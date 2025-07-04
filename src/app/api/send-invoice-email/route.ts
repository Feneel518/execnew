import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { promises as fs } from "fs";
import { format } from "date-fns";

import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export async function POST(req: NextRequest) {
  const {
    to,
    invoiceNumber,
    customerName,
    customerAddress,
    date,
    poNumber,
    poDate,
    productCount,
    lrNumber,
    transporterName,
    lrUrl,
    slug,
    items,
    gstAmount,
    totalAmount,
  } = await req.json();

  const formattedPoDate = poDate
    ? format(new Date(poDate), "dd MMM yyyy")
    : "N/A";

  if (!to || !invoiceNumber || !customerName) {
    return NextResponse.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }

  try {
    // Generate PDF buffer
    // Load and render EJS template
    const filePath = path.join(
      process.cwd(),
      "src",
      "lib",
      "email",
      "email-template.ejs"
    );
    const template = await fs.readFile(filePath, "utf8");

    const html = ejs.render(template, {
      invoiceNumber,
      customerName,
      poNumber,
      poDate: formattedPoDate,
      productCount,
      lrNumber,
      transporterName,
      lrUrl,
      logoUrl: "https://www.explosionproofelectrical.com/logo1.png", // Replace with public logo URL
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EXEC" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Dispatch Details for Invoice ${invoiceNumber}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Email failed to send" },
      { status: 500 }
    );
  }
}
