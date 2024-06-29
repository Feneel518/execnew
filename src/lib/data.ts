export const gstOptions = [
  "IGST_18",
  "CGST_SGST_18",
  "IGST_5",
  "CGST_SGST_5",
  "IGST_12",
  "CGST_SGST_12",
  "IGST_28",
  "CGST_SGST_28",
  "IGST_0_1",
  "CGST_SGST_0_1",
];

export const packingCharges = ["INCLUDED", "EXCLUDED"];

export const paymentTerms = [
  "ADVANCE",
  "AGAINST_PERFOMA_INVOICE",
  "AGAINST_DELIVERY",
  "CREDIT_30",
  "CREDIT_45",
  "CREDIT_60",
];

export const transportationPayment = ["PAID", "TO_PAY"];

export const TESTS = [
  {
    nature: "Routine Static Pressure Test",
    parameters:
      "No Leakage / Deformation found (As per IS/IEC 60079-1) Hydraulic test",
    result:
      "Withstood applied pressure without any deformatin & Leakage of water.",
  },
  {
    nature: "Visual Check",
    parameters: "As per standard practice",
    result: "Found in Order.",
  },
  {
    nature: "Dimentional and flamepath check",
    parameters: "As per drawing",
    result: "Found in Order.",
  },
  {
    nature: "Finish and Assembly",
    parameters: "As per drawing",
    result: "Found in Order.",
  },
  {
    nature: "Thread check by 'Go' Guage",
    parameters: "Gland shall pass through 'Go' Guage",
    result: "Found in Order.",
  },
  {
    nature: "Thread check by 'No-Go' Guage",
    parameters: "Gland shall not pass through 'No-Go' Guage",
    result: "Found in Order.",
  },
  {
    nature: "Marking plate / Tag Plate",
    parameters: "As per drawing",
    result: "Found in Order.",
  },
  {
    nature: "High voltage check",
    parameters: "Item shall withstand 2kV for 60 seconds",
    result: "Found in Order.",
  },
  {
    nature: "Finish (Paint Shade)",
    parameters: "As per drawing",
    result: "Found in Order.",
  },
  {
    nature: "Contunity / Operational Check",
    parameters: "As per drawing",
    result: "Found in Order.",
  },
  {
    nature: "Insulation resistance check before and after HV test",
    parameters: "> 20 Mega Ohm",
    result: ">100 Mega Ohm",
  },
];
