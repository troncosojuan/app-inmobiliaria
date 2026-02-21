import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const basicPlan = await prisma.plan.upsert({
    where: { slug: "basico" },
    update: {},
    create: {
      name: "Básico",
      slug: "basico",
      price: 25000,
      maxProperties: 50,
      maxUsers: 3,
      customDomain: false,
      analytics: false,
      aiFeatures: false,
      ipcAdjustment: false,
      chatAutomation: false,
      crm: false,
      bulkUpload: false,
      seoAdvanced: false,
      customPages: false,
      prioritySupport: false,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { slug: "profesional" },
    update: {},
    create: {
      name: "Profesional",
      slug: "profesional",
      price: 55000,
      maxProperties: 200,
      maxUsers: 10,
      customDomain: true,
      analytics: true,
      aiFeatures: true,
      ipcAdjustment: true,
      chatAutomation: false,
      crm: true,
      bulkUpload: true,
      seoAdvanced: true,
      customPages: true,
      prioritySupport: false,
    },
  });

  const premiumPlan = await prisma.plan.upsert({
    where: { slug: "premium" },
    update: {},
    create: {
      name: "Premium",
      slug: "premium",
      price: 95000,
      maxProperties: -1,
      maxUsers: -1,
      customDomain: true,
      analytics: true,
      aiFeatures: true,
      ipcAdjustment: true,
      chatAutomation: true,
      crm: true,
      bulkUpload: true,
      seoAdvanced: true,
      customPages: true,
      prioritySupport: true,
    },
  });

  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "demo-inmobiliaria" },
    update: {},
    create: {
      name: "Demo Inmobiliaria",
      slug: "demo-inmobiliaria",
      email: "info@demo-inmobiliaria.com",
      phone: "+54 11 1234-5678",
      address: "Av. Santa Fe 1234",
      city: "Buenos Aires",
      state: "CABA",
      primaryColor: "#1e40af",
      secondaryColor: "#f59e0b",
      accentColor: "#10b981",
      whatsapp: "+5411123456789",
      planId: proPlan.id,
    },
  });

  const adminPassword = await hash("admin123", 12);
  const platformAdmin = await prisma.user.upsert({
    where: { email: "admin@platform.com" },
    update: {},
    create: {
      email: "admin@platform.com",
      name: "Admin Plataforma",
      passwordHash: adminPassword,
      role: "PLATFORM_ADMIN",
      isVerified: true,
    },
  });

  const tenantAdmin = await prisma.user.upsert({
    where: { email: "admin@demo-inmobiliaria.com" },
    update: {},
    create: {
      email: "admin@demo-inmobiliaria.com",
      name: "Juan Pérez",
      passwordHash: adminPassword,
      role: "TENANT_ADMIN",
      tenantId: demoTenant.id,
      isVerified: true,
    },
  });

  const propertyTypes = [
    {
      title: "Departamento 3 ambientes en Palermo",
      slug: "departamento-3-ambientes-palermo",
      description:
        "Hermoso departamento de 3 ambientes en el corazón de Palermo. Luminoso, con balcón terraza y vista abierta. Cocina integrada, 2 dormitorios, living-comedor amplio. Edificio con amenities: pileta, SUM, gimnasio y laundry.",
      type: "APARTMENT" as const,
      operation: "SALE" as const,
      price: 185000,
      currency: "USD",
      expenses: 85000,
      address: "Thames 1234",
      city: "Buenos Aires",
      state: "CABA",
      neighborhood: "Palermo",
      totalArea: 78,
      coveredArea: 72,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      garages: 0,
      floor: 8,
      yearBuilt: 2019,
      amenities: ["Pileta", "SUM", "Gimnasio", "Laundry", "Balcón terraza"],
      isFeatured: true,
    },
    {
      title: "Casa 4 ambientes en Belgrano R",
      slug: "casa-4-ambientes-belgrano-r",
      description:
        "Espectacular casa en Belgrano R sobre lote propio. 4 ambientes, jardín con pileta, quincho con parrilla. 3 dormitorios (suite principal con vestidor), living-comedor, cocina independiente, lavadero. Garage para 2 autos.",
      type: "HOUSE" as const,
      operation: "SALE" as const,
      price: 450000,
      currency: "USD",
      address: "Superí 2345",
      city: "Buenos Aires",
      state: "CABA",
      neighborhood: "Belgrano",
      totalArea: 280,
      coveredArea: 210,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      garages: 2,
      yearBuilt: 2005,
      amenities: ["Pileta", "Parrilla", "Jardín", "Quincho", "Garage doble"],
      isFeatured: true,
    },
    {
      title: "Oficina premium en Microcentro",
      slug: "oficina-premium-microcentro",
      description:
        "Oficina de categoría en edificio corporativo. Planta libre, piso técnico, aire acondicionado central. Recepción, sala de reuniones, 2 despachos privados. Edificio con seguridad 24hs.",
      type: "OFFICE" as const,
      operation: "RENT" as const,
      price: 3500,
      currency: "USD",
      address: "Florida 567",
      city: "Buenos Aires",
      state: "CABA",
      neighborhood: "Microcentro",
      totalArea: 120,
      coveredArea: 120,
      rooms: 4,
      bedrooms: 0,
      bathrooms: 2,
      garages: 1,
      floor: 12,
      yearBuilt: 2015,
      amenities: ["Aire central", "Seguridad 24hs", "Piso técnico"],
      isFeatured: false,
    },
    {
      title: "PH reciclado en Villa Crespo",
      slug: "ph-reciclado-villa-crespo",
      description:
        "PH tipo loft completamente reciclado. Doble altura, pisos de cemento alisado, ventanales industriales. Planta baja: living-comedor con cocina integrada. Planta alta: dormitorio en suite. Patio privado.",
      type: "PH" as const,
      operation: "SALE" as const,
      price: 135000,
      currency: "USD",
      address: "Murillo 789",
      city: "Buenos Aires",
      state: "CABA",
      neighborhood: "Villa Crespo",
      totalArea: 65,
      coveredArea: 55,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      garages: 0,
      yearBuilt: 1960,
      amenities: ["Patio privado", "Doble altura", "Reciclado"],
      isFeatured: true,
    },
    {
      title: "Terreno en Nordelta",
      slug: "terreno-nordelta",
      description:
        "Lote en barrio cerrado de Nordelta con vista al lago. Ideal para construir casa a medida. Barrio con seguridad 24hs, club house, canchas de tenis y pileta.",
      type: "LAND" as const,
      operation: "SALE" as const,
      price: 120000,
      currency: "USD",
      address: "Av. de los Lagos s/n",
      city: "Tigre",
      state: "Buenos Aires",
      neighborhood: "Nordelta",
      totalArea: 800,
      coveredArea: 0,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      amenities: ["Vista al lago", "Seguridad 24hs", "Club house"],
      isFeatured: false,
    },
    {
      title: "Departamento 2 ambientes en Recoleta",
      slug: "departamento-2-ambientes-recoleta",
      description:
        "Departamento luminoso de 2 ambientes en Recoleta. Dormitorio con placard, living-comedor, cocina separada, baño completo. Edificio con portería y ascensor. A metros del shopping y transporte.",
      type: "APARTMENT" as const,
      operation: "RENT" as const,
      price: 650000,
      currency: "ARS",
      expenses: 55000,
      address: "Arenales 1456",
      city: "Buenos Aires",
      state: "CABA",
      neighborhood: "Recoleta",
      totalArea: 48,
      coveredArea: 45,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      garages: 0,
      floor: 5,
      yearBuilt: 1985,
      amenities: ["Portería", "Ascensor"],
      isFeatured: false,
    },
  ];

  for (const prop of propertyTypes) {
    await prisma.property.upsert({
      where: {
        tenantId_slug: {
          tenantId: demoTenant.id,
          slug: prop.slug,
        },
      },
      update: {},
      create: {
        tenantId: demoTenant.id,
        agentId: tenantAdmin.id,
        ...prop,
      },
    });
  }

  console.log("Seed completed successfully");
  console.log({ basicPlan, proPlan, premiumPlan });
  console.log({ demoTenant });
  console.log({ platformAdmin: platformAdmin.email, tenantAdmin: tenantAdmin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
