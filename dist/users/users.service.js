"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_schema_1 = require("../schemas/user.schema");
const swagger_1 = require("@nestjs/swagger");
const json2csv_1 = require("json2csv");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const newUser = new this.userModel(createUserDto);
        if (await this.userModel.findOne({ email: createUserDto.email })) {
            throw new common_1.HttpException('Email duplicado', common_1.HttpStatus.CONFLICT);
        }
        if (await this.userModel.findOne({ id: createUserDto.id })) {
            throw new common_1.HttpException('ID duplicado', common_1.HttpStatus.BAD_REQUEST);
        }
        await newUser.save();
        return newUser;
    }
    findAll() {
        console.log('here');
        return this.userModel.find().exec();
    }
    findOne(id) {
        if (!isNaN(parseFloat(id)) && isFinite(Number(id))) {
            return this.userModel.find({ id: Number(id) }).exec();
        }
        return this.userModel.find({ id }).exec();
    }
    findOneByEmail(email) {
        return this.userModel.findOne({ email: email }).exec();
    }
    update(id, updateUserDto) {
        if (!isNaN(parseFloat(id)) && isFinite(Number(id))) {
            return this.userModel
                .findOneAndUpdate({ id: Number(id) }, updateUserDto)
                .exec();
        }
        else {
            return this.userModel.findOneAndUpdate({ id }).exec();
        }
    }
    remove(id) {
        return this.userModel.deleteOne({ id }).exec();
    }
    async generateReport() {
        try {
            const users = await this.userModel
                .find({}, { id: 1, name: 1, email: 1 })
                .lean()
                .exec();
            const fields = [
                { label: 'ID', value: 'id' },
                { label: 'Nome', value: 'name' },
                { label: 'Email', value: 'email' },
            ];
            const csv = (0, json2csv_1.parse)(users, { fields });
            return csv;
        }
        catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    }
};
exports.UsersService = UsersService;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cria um novo usuário' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os usuários cadastrados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersService.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Busca um usuário pelo ID' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersService.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Busca um usuário pelo email' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersService.prototype, "findOneByEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza um usuário' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersService.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove um usuário' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersService.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Gera um relatório de usuários' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "generateReport", null);
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map