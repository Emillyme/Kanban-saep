import { z } from "zod"; 

export const signupSchema = z.object({
    username: z.string()
        .nonempty("Digite um username"),
    email: z.string()
        .nonempty("Digite um email")
        .regex(/^[\w.-]+@gmail\.com$/, "Apenas emails Gmail é permitido"),
})
