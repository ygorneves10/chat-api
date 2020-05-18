const bcrypt = require("bcrypt");
const slugify = require('slugify');

export const mainController = {
    comparePassword: async (password: String, validPassword: String): Promise<String> => await bcrypt.compareSync(password, validPassword),
    bcryptPassword: async (password: String): Promise<String> => await bcrypt.hash(password, bcrypt.genSaltSync(8)),
    generateSlug: (string: String): String => slugify(string)
}