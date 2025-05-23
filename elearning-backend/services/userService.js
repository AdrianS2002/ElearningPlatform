const userRepository = require("../repository/userRepository");

class UserService {
    async getUsers() {
        return await userRepository.findAll();
    }

    async getUserById(id) {
        return await userRepository.findById(id);
    }

    async createUser(userData) {
        return await userRepository.create(userData);
    }

    async updateUser(id, userData) {
        return await userRepository.update(id, userData);
    }

    async deleteUser(id) {
        return await userRepository.delete(id);
    }
}

module.exports = new UserService();
