import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const passwordRules: Array<[RegExp, string]> = [
  [/.{8,}/, "ter pelo menos 8 caracteres"],
  [/[A-Z]/, "ter uma letra maiúscula"],
  [/[a-z]/, "ter uma letra minúscula"],
  [/[0-9]/, "ter um número"],
  [/[\W_]/, "ter um caractere especial"],
];

async function main() {
  const name = process.env.ADMIN_NAME || "Administrador";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar o seed.",
    );
  }

  const unmet = passwordRules
    .filter(([rule]) => !rule.test(password))
    .map(([, message]) => message);

  if (unmet.length > 0) {
    throw new Error(`A senha do admin deve: ${unmet.join(", ")}.`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Usuário ${email} já existe. Nada foi alterado.`);
    return;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "admin",
    },
  });

  console.log(`Administrador criado: ${email}`);
  console.log(
    "Remova ADMIN_PASSWORD do .env e troque a senha depois do primeiro acesso.",
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
