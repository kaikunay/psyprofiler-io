const fs = require('fs');
const file = 'src/lib/auth-config.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('PrismaAdapter')) {
  code = `import { PrismaAdapter } from "@next-auth/prisma-adapter";\nimport { prisma } from "./prisma";\n` + code;
  code = code.replace('providers: [', 'adapter: PrismaAdapter(prisma),\n  providers: [');
  fs.writeFileSync(file, code);
  console.log("Patched auth-config.ts");
} else {
  console.log("Already patched");
}
