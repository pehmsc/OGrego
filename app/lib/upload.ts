// app/lib/upload.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Upload de imagem para Cloudflare R2
 */
export async function uploadImageToR2(
    file: File,
    folder: string,
    userId: string,
): Promise<UploadResult> {
    try {
        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return {
                success: false,
                error: "Imagem muito grande (máximo 5MB)",
            };
        }

        // Validar tipo
        if (!file.type.startsWith("image/")) {
            return {
                success: false,
                error: "Ficheiro inválido (apenas imagens)",
            };
        }

        // Gerar nome único
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const extension = file.name.split(".").pop();
        const fileName = `${folder}/${userId}/${timestamp}-${randomStr}.${extension}`;

        // Converter File para Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload para R2
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(uploadCommand);

        // URL pública
        const url = `${process.env.R2_PUBLIC_URL}/${fileName}`;

        return {
            success: true,
            url,
        };
    } catch (error) {
        console.error("Erro ao fazer upload:", error);
        return {
            success: false,
            error: "Erro ao fazer upload da imagem",
        };
    }
}
