"use server";

import { getCurrentUserDb } from "@/app/lib/current-user";
import { sql } from "@/app/lib/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

// Cliente S3 para Cloudflare R2
const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function createFeedback(formData: FormData) {
    try {
        const userDb = await getCurrentUserDb();

        const rating = parseInt(formData.get("rating") as string);
        const comment = formData.get("comment") as string;
        const imageFile = formData.get("image") as File | null;

        // Validação
        if (!rating || rating < 1 || rating > 5) {
            return { success: false, error: "Avaliação inválida" };
        }

        if (!comment || comment.trim().length < 10) {
            return {
                success: false,
                error: "Comentário muito curto (mínimo 10 caracteres)",
            };
        }

        let imageUrl: string | null = null;

        // Upload de imagem se existir
        if (imageFile && imageFile.size > 0) {
            // Validar tamanho (max 5MB)
            if (imageFile.size > 5 * 1024 * 1024) {
                return {
                    success: false,
                    error: "Imagem muito grande (máximo 5MB)",
                };
            }

            // Validar tipo
            if (!imageFile.type.startsWith("image/")) {
                return {
                    success: false,
                    error: "Ficheiro inválido (apenas imagens)",
                };
            }

            // Gerar nome único
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(7);
            const extension = imageFile.name.split(".").pop();
            const fileName = `feedback/${userDb.id}/${timestamp}-${randomStr}.${extension}`;

            // Converter File para Buffer
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload para R2
            const uploadCommand = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: fileName,
                Body: buffer,
                ContentType: imageFile.type,
            });

            await s3Client.send(uploadCommand);

            // URL pública
            imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
        }

        // Inserir feedback na BD
        await sql`
      INSERT INTO feedback (user_id, rating, comment, image_url)
      VALUES (${userDb.id}, ${rating}, ${comment}, ${imageUrl})
    `;

        revalidatePath("/user/feedback");

        return { success: true };
    } catch (error) {
        console.error("Erro ao criar feedback:", error);
        return { success: false, error: "Erro ao enviar feedback" };
    }
}

export async function getUserFeedbacks(userId: string) {
    try {
        const result = await sql<any[]>`
      SELECT 
        id,
        rating,
        comment,
        image_url,
        TO_CHAR(created_at, 'DD "de" Mon "de" YYYY') as date,
        created_at
      FROM feedback
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

        return result;
    } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
        return [];
    }
}

export async function getUserFeedbackStats(userId: string) {
    try {
        const result = await sql<any[]>`
      SELECT 
        COUNT(*)::int as total_feedbacks,
        ROUND(AVG(rating)::numeric, 1) as average_rating,
        EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 as hours_diff
      FROM feedback
      WHERE user_id = ${userId}
    `;

        const row = result[0];

        let lastFeedback = "Nenhum feedback";
        if (row.hours_diff) {
            const hours = Math.floor(row.hours_diff);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                lastFeedback = `Há ${days} dia${days > 1 ? "s" : ""}`;
            } else if (hours > 0) {
                lastFeedback = `Há ${hours} hora${hours > 1 ? "s" : ""}`;
            } else {
                lastFeedback = "Há menos de 1 hora";
            }
        }

        return {
            totalFeedbacks: row.total_feedbacks || 0,
            averageRating: parseFloat(row.average_rating) || 0,
            lastFeedback,
        };
    } catch (error) {
        console.error("Erro ao buscar stats de feedback:", error);
        return {
            totalFeedbacks: 0,
            averageRating: 0,
            lastFeedback: "Nenhum feedback",
        };
    }
}
