const nodemailer = require('nodemailer');

const sendOrderConfirmationEmail = async (orderData) => {
    // Configure transporter (Using Ethereal or Placeholder for now)
    // In production, use your real SMTP details in .env
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Format items for HTML template
    const itemsHtml = orderData.items.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${item.image[0]}" alt="${item.name}" style="width: 70px; height: 90px; object-fit: cover; background-color: #f5f5f5;" />
                <div>
                    <h4 style="margin: 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">${item.name}</h4>
                    <p style="margin: 5px 0 0; font-size: 11px; color: #888; text-transform: uppercase;">Size: ${item.size} | Qty: ${item.quantity}</p>
                </div>
            </div>
            <p style="font-size: 14px; font-weight: 500;">Rs.${item.price.toFixed(2)}</p>
        </div>
    `).join('');

    const mailOptions = {
        from: '"Vogue Echo Archival" <na619277@gmail.com>',
        to: orderData.address.email,
        subject: `Selection Confirmed: ${orderData.orderId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
                <style>
                    @media only screen and (max-width: 600px) {
                        .container { width: 100% !important; padding: 20px !important; }
                        .header-box { padding: 40px 20px !important; }
                        .info-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
                        .info-col { width: 100% !important; display: block !important; text-align: left !important; }
                        .financial-col { text-align: left !important; margin-top: 30px; }
                        .financial-col table { text-align: left !important; }
                        .financial-col td:last-child { text-align: right !important; }
                        h1 { font-size: 26px !important; }
                        .track-btn { width: 100% !important; padding: 20px !important; box-sizing: border-box; }
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Inter', sans-serif; color: #1a1a1a;">
                <center>
                    <div class="container" style="max-width: 600px; width: 100%; margin: 0 auto;">
                        <!-- Header Section -->
                        <div style="background-color: #eeeeee; padding: 40px 20px;">
                            <div class="header-box" style="background-color: #ffffff; padding: 60px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative;">
                                <h1 style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; margin: 0 0 20px 0; letter-spacing: 1px;">Thank You for Your Order</h1>
                                <p style="font-size: 13px; line-height: 1.8; color: #666; margin: 0; max-width: 400px; margin: 0 auto;">
                                    We are preparing your architectural apparel for shipment.<br>
                                    Experience the fusion of form and function.
                                </p>
                            </div>
                        </div>

                        <!-- Content Section -->
                        <div style="padding: 40px 20px; text-align: left;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px;">
                                <div>
                                    <span style="font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #a88a6d; text-transform: uppercase; display: block; margin-bottom: 8px;">CONFIRMATION</span>
                                    <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; margin: 0;">Order #${orderData.orderId}</h2>
                                </div>
                                <div style="text-align: right;">
                                    <p style="font-size: 12px; color: #888; font-style: italic; margin: 0;">${new Date(orderData.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <span style="font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #a88a6d; text-transform: uppercase; display: block; margin-bottom: 30px;">YOUR CURATION</span>
                            ${itemsHtml}

                            <div class="info-grid" style="background-color: #f9f9f9; padding: 30px; margin: 40px 0;">
                                <div class="info-col" style="vertical-align: top; width: 45%; display: inline-block;">
                                    <span style="font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #a88a6d; text-transform: uppercase; display: block; margin-bottom: 20px;">SHIPPING DESTINATION</span>
                                    <div style="font-size: 13px; line-height: 1.8; color: #1a1a1a;">
                                        <p style="font-weight: 600; margin: 0;">${orderData.address.firstName} ${orderData.address.lastName}</p>
                                        <p style="margin: 0;">${orderData.address.street}</p>
                                        <p style="margin: 0;">${orderData.address.city}, ${orderData.address.zipcode}</p>
                                    </div>
                                </div>
                                <div class="info-col financial-col" style="vertical-align: top; width: 50%; display: inline-block; text-align: right;">
                                    <span style="font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #a88a6d; text-transform: uppercase; display: block; margin-bottom: 20px;">FINANCIAL SUMMARY</span>
                                    <table style="width: 100%; font-size: 13px; color: #666; border-collapse: collapse;">
                                        <tr><td style="padding-bottom: 10px;">Subtotal</td><td style="text-align: right; color: #1a1a1a;">Rs.${(orderData.amount + orderData.discount).toFixed(2)}</td></tr>
                                        ${orderData.discount > 0 ? `<tr><td style="padding-bottom: 10px;">Discount</td><td style="text-align: right; color: #ef4444;">-Rs.${orderData.discount.toFixed(2)}</td></tr>` : ''}
                                        <tr><td style="padding-bottom: 10px;">Shipping</td><td style="text-align: right; font-style: italic; color: #a88a6d;">Rs.250.00</td></tr>
                                        <tr style="border-top: 1px solid #ddd; font-size: 20px; font-family: 'Playfair Display', serif;">
                                            <td style="padding-top: 20px; color: #1a1a1a; font-weight: bold;">Total</td>
                                            <td style="padding-top: 20px; text-align: right; color: #1a1a1a; font-weight: bold;">Rs.${(orderData.amount + 250).toFixed(2)}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <div style="text-align: center; margin: 60px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order?id=${orderData.orderId}" class="track-btn" style="background-color: #1a1a1a; color: #ffffff; padding: 20px 60px; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 2px; display: inline-block; text-transform: uppercase;">TRACK YOUR SHIPMENT</a>
                            </div>

                            <div style="text-align: center; border-top: 1px solid #f0f0f0; padding-top: 60px;">
                                <p style="font-size: 12px; line-height: 1.8; color: #888; max-width: 400px; margin: 0 auto;">Our concierge team is available to assist with your delivery inquiries and curation requests.</p>
                            </div>
                        </div>
                    </div>
                </center>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully");
    } catch (error) {
        console.log("Email Error:", error);
    }
};

module.exports = { sendOrderConfirmationEmail };
