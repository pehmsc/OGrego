import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderEmailData = {
    to: string;
    customerName: string;
    orderId: number;
    orderType: "delivery" | "takeaway";
    deliveryAddress?: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: string;
    notes?: string;
};

export async function sendOrderConfirmation(data: OrderEmailData) {
    try {
        const {
            to,
            customerName,
            orderId,
            orderType,
            items,
            subtotal,
            deliveryFee,
            total,
            deliveryAddress,
            paymentMethod,
            notes,
        } = data;

        // Formatar lista de items
        const itemsHtml = items
            .map(
                (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
          ${item.name} x${item.quantity}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          €${item.subtotal.toFixed(2)}
        </td>
      </tr>
    `,
            )
            .join("");

        await resend.emails.send({
            from: "O Grego <encomendas@resend.dev>", // ⚠️ Muda depois para teu domínio
            to: to,
            subject: `Encomenda #${orderId} confirmada!`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">O Grego</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Sabores Autênticos da Grécia</p>
            </div>

            <!-- Confirmação -->
            <div style="background: #f8fafc; padding: 30px; border-left: 4px solid #10b981;">
              <h2 style="margin: 0 0 10px 0; color: #10b981; font-size: 24px;">✓ Encomenda Confirmada!</h2>
              <p style="margin: 0; color: #64748b;">Obrigado pela sua encomenda, <strong>${customerName}</strong>!</p>
            </div>

            <!-- Detalhes da Encomenda -->
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb;">
              
              <div style="background: #1E3A8A; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">Número da encomenda</p>
                <h3 style="margin: 5px 0 0 0; font-size: 32px;">#${orderId}</h3>
              </div>

              <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div style="flex: 1; background: #f1f5f9; padding: 15px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Tipo</p>
                  <p style="margin: 5px 0 0 0; font-weight: 600; color: #1E3A8A;">
                    ${orderType === "delivery" ? "Delivery" : "Takeaway"}
                  </p>
                </div>
                <div style="flex: 1; background: #f1f5f9; padding: 15px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Tempo Estimado</p>
                  <p style="margin: 5px 0 0 0; font-weight: 600; color: #1E3A8A;">30-45 min</p>
                </div>
              </div>

              ${
                  deliveryAddress
                      ? `
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 12px; color: #92400e; text-transform: uppercase; font-weight: 600;">Morada de Entrega</p>
                  <p style="margin: 5px 0 0 0; color: #78350f;">${deliveryAddress}</p>
                </div>
              `
                      : ""
              }

              ${
                  notes
                      ? `
                <div style="background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 12px; color: #075985; text-transform: uppercase; font-weight: 600;">Observações</p>
                  <p style="margin: 5px 0 0 0; color: #0c4a6e;">${notes}</p>
                </div>
              `
                      : ""
              }

              <!-- Items -->
              <h3 style="margin: 0 0 15px 0; color: #1E3A8A; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Itens da Encomenda</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Totais -->
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #64748b;">Subtotal</span>
                  <span style="font-weight: 500;">€${subtotal.toFixed(2)}</span>
                </div>
                
                ${
                    deliveryFee > 0
                        ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #64748b;">Portes</span>
                    <span style="font-weight: 500;">€${deliveryFee.toFixed(2)}</span>
                  </div>
                `
                        : `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #10b981;">Portes</span>
                    <span style="font-weight: 600; color: #10b981;">Grátis</span>
                  </div>
                `
                }

                <div style="border-top: 2px solid #e5e7eb; margin: 10px 0; padding-top: 10px; display: flex; justify-content: space-between;">
                  <span style="font-weight: 700; font-size: 18px; color: #1E3A8A;">Total</span>
                  <span style="font-weight: 700; font-size: 18px; color: #1E3A8A;">€${total.toFixed(2)}</span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                  <span style="color: #64748b; font-size: 14px;">Método de Pagamento</span>
                  <span style="font-weight: 500; font-size: 14px;">${paymentMethod === "mbway" ? "MB WAY" : paymentMethod === "card" ? "Cartão" : paymentMethod === "cash" ? "Dinheiro" : "Multibanco"}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                Tem alguma questão? Contacte-nos:
              </p>
              <p style="margin: 0; color: #1E3A8A; font-weight: 600;">
                📞 +351 21 123 4567 | 📧 info@ogrego.pt
              </p>
              <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 12px;">
                © 2025 O Grego. Todos os direitos reservados.
              </p>
            </div>

          </body>
        </html>
      `,
        });

        console.log("Email enviado para:", to);
        return { success: true };
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
        };
    }
}
