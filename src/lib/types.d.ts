import {
  Category,
  Customer,
  GST,
  PackingCharges,
  PaymentTerms,
  Prisma,
  ProductComponents,
  TransportationPayment,
  UserRole,
} from "@prisma/client";
import { Component } from "lucide-react";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export type ProductWithProductComponentsOnProducts = Prisma.UserGetPayload<{
  include: {
    ProductComponentsOnProducts: {
      include: {
        ProductComponent: true;
      };
    };
  };
}>;

export type QuotationType = {
  id: string;
  clientName?: string;
  quotationNumber: number;
  additionalNotes?: string;
  gst: GST;
  packingCharges: PackingCharges;
  paymentTerms: PaymentTerms;
  transportationPayment: TransportationPayment;
  deliveryDate: Date;
  discount?: string;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  customerId: string;
  ProductInQuotation: ProductInQuotation[];
};

export type ProductInQuotation = {
  id: string;
  rating?: string;
  terminals?: string;
  hardware?: string;
  gasket?: string;
  mounting?: string;
  cableEntry?: string;
  earting?: string;
  typeNumber?: string;
  hsnCode?: string;
  cutoutSize?: string;
  plateSize?: string;
  glass?: string;
  wireGuard?: string;
  index?: number;
  variant?: string;
  size?: string;
  rpm?: string;
  kW?: string;
  HorsePower?: string;
  poReferrence?: string;
  quantity?: string;
  price: number;
  quotation: Quotation;
  quotationId: string;
  product: Product;
  productId: string;
  components: Component[];
  ComponentsOfProductInQuotation: ComponentsOfProductInQuotationType[];

  createdAt: Date;
  updatedAt: Date;
};

export type Component = {
  items: string;
};

export type ComponentsOfProductInQuotationType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  productInQuotationId: string;
  productInQuotation: ProductInQuotation;

  componentsOfQuotation: ComponentsOfQuotation;
  componentsOfQuotationId: string;
};

export type ComponentsOfQuotationType = {
  id: string;
  item: string;
  createdAt: Date;
  updatedAt: Date;
  ComponentsOfProductInQuotation: ComponentsOfProductInQuotationType[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  type: string;
  protection: string;
  gasGroup: string;
  material: string;
  finish: string;
  rating?: string;
  terminals?: string;
  hardware?: string;
  gasket?: string;
  mounting?: string;
  cableEntry?: string;
  earting?: string;
  typeNumber?: string;
  hsnCode?: string;
  cutoutSize?: string;
  plateSize?: string;
  glass?: string;
  wireGuard?: string;
  variant?: string;
  size?: string;
  rpm?: string;
  kW?: string;
  HorsePower?: string;

  createdAt: Date;
  updatedAt: Date;

  ProductComponentsOnProducts: ProductComponentsOnProducts[];

  Category: Category;
  categoryId: string;
  ProductInQuotation: ProductInQuotation[];
};

export type ProductComponentsOnProducts = {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  productId: string;
  product: Product;

  productComponentsId: string;
  productComponents: ProductComponents;
};

export type QuotationWithProductInQuotation = Prisma.QuotationGetPayload<{
  include: {
    customer: true;
    ProductInQuotation: {
      include: {
        ComponentsOfProductInQuotation: {
          include: {
            componentsOfQuotation: {
              select: {
                item: true;
              };
            };
          };
        };
        product: {
          include: {
            ProductComponentsOnProducts: {
              include: {
                productComponents: {
                  select: {
                    item: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;
export type AQuotationWithProductInQuotation =
  Prisma.ArchivedQuotationGetPayload<{
    include: {
      customer: true;
      ArchivedProductInQuotation: {
        include: {
          product: {
            include: {
              ProductComponentsOnProducts: {
                include: {
                  productComponents: {
                    select: {
                      item: true;
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>;

export type ProductInQuotationTypes = Prisma.ProductInQuotationGetPayload<{
  include: {
    ComponentsOfProductInQuotation: {
      include: {
        componentsOfQuotation: {
          select: {
            item: true;
          };
        };
      };
    };
    product: {
      include: {
        ProductComponentsOnProducts: {
          include: {
            productComponents: {
              select: {
                item: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type QuotationForDashboard = Prisma.QuotationGetPayload<{
  include: {
    customer: {
      select: {
        id: true;
      };
    };
    ProductInQuotation: {
      include: {
        ComponentsOfProductInQuotation: {
          include: {
            componentsOfQuotation: {
              select: {
                id: true;
                item: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type OrderForDashboard = Prisma.OrderGetPayload<{
  select: {
    id: true;
    customerId: true;
    notes: true;
    orderNumber: true;
    poNumber: true;
    poDate: true;
    quotationNumber: true;
    status: true;
    orderPDFFile: true;
    ProductInOrder: {
      select: {
        // index: true,
        index: true;
        certificateNumber: true;
        description: true;
        productId: true;
        price: true;
        quantity: true;
        supplied: true;
        id: true;
      };
    };
  };
}>;

export type OrderColumns = Prisma.OrderGetPayload<{
  select: {
    id: true;
    orderNumber: true;
    poNumber: true;
    poDate: true;
    customer: {
      select: {
        name: true;
      };
    };
    ProductInOrder: {
      select: {
        id: true;
      };
    };
  };
}>;

export type OrderToView = Prisma.OrderGetPayload<{
  select: {
    createdAt: true;
    poDate: true;
    poNumber: true;
    quotationNumber: true;
    notes: true;
    status: true;
    orderNumber: true;
    orderPDFFile: true;
    customer: {
      select: {
        name: true;
        addressLine1: true;
        GST: true;
        pincode: true;
        state: true;
      };
    };
    ProductInOrder: {
      select: {
        id: true;
        // index: true,
        index: true;
        price: true;
        quantity: true;
        supplied: true;
        description: true;
        certificateNumber: true;
        product: {
          select: {
            name: true;
            typeNumber: true;
            protection: true;
            gasGroup: true;
            type: true;
          };
        };
      };
    };
  };
}>;

export type ProductInOrderTable = Prisma.ProductInOrderGetPayload<{
  select: {
    id: true;
    price: true;
    quantity: true;
    supplied: true;
    description: true;
    certificateNumber: true;
    index: true;
    product: {
      select: {
        name: true;
      };
    };
  };
}>;

export type CatalogTable = Prisma.CategoryGetPayload<{
  where: {
    product: {
      some: {
        image: {
          not: "";
        };
      };
    };
  };
  select: {
    name: true;
    product: {
      where: {
        image: {
          not: "";
        };
      };
      select: {
        name: true;
        image: true;
        gasGroup: true;
      };
    };
  };
  orderBy: {
    name: "asc";
  };
}>;

export type productCatalog = Prisma.ProductGetPayload<{
  product: {
    where: {
      image: {
        not: "";
      };
    };
    select: {
      name: true;
      image: true;
      gasGroup: true;
    };
  };
}>;

export type FeasturedProducts = Prisma.ProductGetPayload<{
  select: {
    name: true;
    id: true;
    image: true;
  };
}>;

export type CategoriesAndProducts = Prisma.CategoryGetPayload<{
  include: {
    product: {
      select: {
        name: true;
        id: true;
        slug: true;
        image: true;
      };
    };
  };
}>;

export type productForm = Prisma.ProductGetPayload<{
  include: {
    ProductComponentsOnProducts: {
      select: {
        productComponents: {
          select: {
            item: true;
          };
        };
      };
    };
  };
}>;

export type OrderTable = Prisma.OrderGetPayload<{
  select: {
    id: true;
    orderNumber: true;
    poNumber: true;
    poDate: true;
    status: true;
    customer: {
      select: {
        name: true;
      };
    };
    ProductInOrder: {
      select: {
        id: true;
      };
    };
  };
}>;
export type ArchiveOrderTable = Prisma.ArchiveOrderGetPayload<{
  select: {
    id: true;
    orderNumber: true;
    poNumber: true;
    poDate: true;
    status: true;
    customer: {
      select: {
        name: true;
      };
    };
    ArchiveProductInOrder: {
      select: {
        id: true;
      };
    };
  };
}>;

export type challanTable = Prisma.DeliveryChallanGetPayload<{
  select: {
    id: true;
    createdAt: true;
    causeOfChallan: true;
    status: true;
    customer: {
      select: {
        name: true;
      };
    };
    challanNumber: true;
    ProductInChallan: {
      select: {
        id: true;
      };
    };
  };
}>;

export type ChallanType = Prisma.DeliveryChallanGetPayload<{
  include: {
    ProductInChallan: true;
  };
}>;

export type Quotationtable = Prisma.QuotationGetPayload<{
  select: {
    id: true;
    createdAt: true;
    customer: {
      select: {
        name: true;
      };
    };
    quotationNumber: true;
    orderNumber: true;

    ProductInQuotation: {
      select: {
        id: true;
      };
    };
  };
}>;
export type ArchiveQuotationtable = Prisma.ArchivedQuotationGetPayload<{
  select: {
    id: true;
    createdAt: true;
    originalId: true;
    customer: {
      select: {
        name: true;
      };
    };
    quotationNumber: true;
    orderNumber: true;

    ArchivedProductInQuotation: {
      select: {
        id: true;
      };
    };
  };
}>;

export type ChallanTypeForDisplay = Prisma.DeliveryChallanGetPayload<{
  include: {
    customer: true;
    ProductInChallan: {
      include: {
        product: {
          select: {
            name: true;
            id: true;
          };
        };
      };
    };
  };
}>;

export type ProductInChallanTable = Prisma.ProductInChallanGetPayload<{
  include: {
    product: {
      select: {
        name: true;
        id: true;
      };
    };
  };
}>;

export type InventoryForDashboard = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    storeProductId: true;
    employeeId: true;
    status: true;
    quantity: true;
  };
}>;

export type Inventorytable = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    employee: {
      select: {
        name: true;
      };
    };
    quantity: true;
    storeProduct: {
      select: {
        name: true;
        StoreProductId: true;
      };
    };
    status: true;
    createdAt: true;
  };
}>;

export type PendingCustomerTable = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    ProductInOrder: {
      include: {
        ProductInInvoiceOfOrder: true;
        order: true;
        product: true;
      };
    };
  };
}>;

export type SelectPOs = Prisma.OrderGetPayload<{
  select: {
    id: true;
    poNumber: true;
    orderNumber: true;
  };
}>;

export type OrderInvoice = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    ProductInOrder: {
      include: {
        product: true;
      };
    };
    Invoice: {
      include: {
        ProductInInvoiceOfOrder: true;
      };
    };
  };
}>;

export type InvoiceTable = Prisma.InvoiceGetPayload<{
  select: {
    id: true;
    invoiceNumber: true;
    invoiceDate: true;
    order: {
      select: {
        id: true;
        poNumber: true;
        poDate: true;
        orderNumber: true;
        customer: {
          select: {
            name: true;
          };
        };
      };
    };
    ProductInInvoiceOfOrder: {
      select: {
        id: true;
        certificateNumber: true;
      };
    };
  };
}>;
export type InvoiceEditType = Prisma.InvoiceGetPayload<{
  include: {
    order: {
      include: {
        ProductInOrder: true;
        customer: true;
      };
    };
    ProductInInvoiceOfOrder: {
      include: {
        ProductInOrder: {
          select: {
            product: {
              select: {
                name: true;
              };
            };
            description: true;
            quantity: true;
          };
        };
      };
    };
  };
}>;

export type PerfomaInvoiceTable = Prisma.PerfomaInvoiceGetPayload<{
  include: {
    order: {
      include: {
        customer: true;
      };
    };
    ProductInPerfomaInvoiceOfOrder: {
      include: {
        ProductInOrder: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;

export type perfomaInvoiceForDisplay = Prisma.PerfomaInvoiceGetPayload<{
  include: {
    order: {
      select: {
        orderNumber: true;
        poNumber: true;
        poDate: true;
        customer: {
          select: {
            name: true;
            addressLine1: true;
            GST: true;
            pincode: true;
            state: true;
          };
        };
      };
    };
    ProductInPerfomaInvoiceOfOrder: {
      include: {
        ProductInOrder: {
          select: {
            id: true;
            // index: true,
            index: true;
            price: true;
            quantity: true;
            supplied: true;
            description: true;
            product: {
              select: {
                name: true;
                id: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type InvoicePageType = Prisma.InvoiceGetPayload<{
  include: {
    order: {
      select: {
        poNumber: true;
        orderNumber: true;
        poDate: true;
        quotationNumber: true;
        customer: {
          select: {
            name: true;
            addressLine1: true;
            GST: true;
            pincode: true;
            state: true;
          };
        };
      };
    };
    ProductInInvoiceOfOrder: {
      include: {
        ProductInOrder: {
          select: {
            id: true;
            // index: true,
            index: true;
            price: true;
            quantity: true;
            supplied: true;
            description: true;
            certificateNumber: true;
            product: {
              select: {
                name: true;
                typeNumber: true;
                protection: true;
                gasGroup: true;
                type: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type ProductInInvoiceTable = Prisma.ProductInInvoiceOfOrderGetPayload<{
  include: {
    ProductInOrder: {
      include: {
        product: true;
      };
    };
    certificateNumber: true;
    id: true;
    invoiceId: true;
    numberOfBoxes: true;
    productInOrderId: true;
    supplidQuantity: true;
    typeNumber: true;
  };
}>;

export type InvoiceEditType = Prisma.InvoiceGetPayload<{
  include: {
    order: {
      include: {
        ProductInOrder: true;
        customer: true;
      };
    };
    ProductInInvoiceOfOrder: {
      include: {
        ProductInOrder: {
          select: {
            product: {
              select: {
                name: true;
              };
            };
            description: true;
            quantity: true;
          };
        };
      };
    };
  };
}>;

export type InventoryTable = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    employee: {
      select: {
        name: true;
      };
    };
    quantity: true;
    storeProduct: true;
    status: true;
    createdAt: true;
  };
}>;

export type StockData = Prisma.InventoryGetPayload<{
  select: {
    quantity: true;
    status: true;
    storeProduct: {
      select: {
        name: true;
        StoreProductId: true;
      };
    };
  };
}>;

export type ProductInPerfomaInvoiceTable =
  Prisma.ProductInPerfomaInvoiceOfOrderGetPayload<{
    include: {
      ProductInOrder: {
        select: {
          id: true;
          // index: true,
          index: true;
          price: true;
          quantity: true;
          supplied: true;
          description: true;
          product: {
            select: {
              name: true;
              typeNumber: true;
              protection: true;
              gasGroup: true;
              type: true;
            };
          };
        };
      };
    };
  }>;

export type PerfomaDetailsType = Prisma.PerfomaInvoiceGetPayload<{
  include: {
    ProductInPerfomaInvoiceOfOrder: {
      include: {
        ProductInOrder: {
          include: {
            product: {
              select: {
                id: true;
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

// /////////////////////////////////////////////

export type TransactionTable = Prisma.AluminumTransactionGetPayload<{
  select: {
    id: true;
    inwardType: true;

    createdAt: true;
    supplier: {
      select: {
        name: true;
      };
    };
    user: {
      select: {
        name: true;
      };
    };
    weight: true;
    status: true;
  };
}>;

export type TransactionType = Prisma.AluminumTransactionGetPayload<{
  include: {
    TransactionCalculation: true;
    CastingForTransaction: true;
    supplier: {
      select: {
        id: true;
        name: true;
      };
    };
    user: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type CastingType = Prisma.CastingsGetPayload<{
  include: {
    ProductsForCasting: {
      include: {
        product: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;
