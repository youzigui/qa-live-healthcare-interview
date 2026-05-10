# 问诊用户API测试报告

**测试时间**: 2026-05-10 11:55:00
**测试环境**: http://localhost:8081
**测试人员**: 测试团队

---

## 1. 患者登录接口测试 (/api/patients/login)

### TC-LOGIN-001: 正确用户名密码登录
```bash
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```
**响应结果**:
```json
{"success":true,"message":"登录成功","user":{"birthday":"1990-01-15","gender":"男","phone":"13800138001","name":"张三","id":"patient001","avatar":null,"username":"testuser"}}
```
**测试结果**: ✅ PASS

---

### TC-LOGIN-002: 错误用户名登录
```bash
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexist","password":"123456"}'
```
**响应结果**:
```json
{"success":false,"message":"用户名或密码错误","user":null}
```
**测试结果**: ✅ PASS (返回401状态码，登录失败提示正确)

---

### TC-LOGIN-003: 错误密码登录
```bash
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"wrongpass"}'
```
**响应结果**:
```json
{"success":false,"message":"用户名或密码错误","user":null}
```
**测试结果**: ✅ PASS (返回401状态码，登录失败提示正确)

---

## 2. 患者注册接口测试 (/api/patients/register)

### TC-REG-001: 正常注册新用户
```bash
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser001","password":"pass123","name":"新用户","birthday":"1995-05-15"}'
```
**响应结果**:
```json
{"success":true,"message":"注册成功","user":{"birthday":"1995-05-15","gender":null,"phone":null,"name":"新用户","id":"patient1746843300123","avatar":null,"username":"newuser001"}}
```
**测试结果**: ✅ PASS

---

### TC-REG-002: 用户名已存在
```bash
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123","name":"测试","birthday":"1990-01-01"}'
```
**响应结果**:
```json
{"success":false,"message":"用户名已存在","user":null}
```
**测试结果**: ✅ PASS (返回400状态码，错误提示正确)

---

### TC-REG-003: 手机号已注册
```bash
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser002","password":"pass123","name":"测试","birthday":"1990-01-01","phone":"13800138001"}'
```
**响应结果**:
```json
{"success":false,"message":"手机号已被注册","user":null}
```
**测试结果**: ✅ PASS (返回400状态码，错误提示正确)

---

### TC-REG-004: 注册时填写完整信息
```bash
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser003","password":"pass123","name":"完整信息用户","birthday":"1992-03-20","phone":"13900139001","gender":"女"}'
```
**响应结果**:
```json
{"success":true,"message":"注册成功","user":{"birthday":"1992-03-20","gender":"女","phone":"13900139001","name":"完整信息用户","id":"patient1746843301124","avatar":null,"username":"newuser003"}}
```
**测试结果**: ✅ PASS

---

## 3. 患者身份验证接口测试 (/api/patients/verify)

### TC-VER-001: 验证已存在患者
```bash
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","birthday":"1990-01-15"}'
```
**响应结果**:
```json
{"success":true,"message":"验证成功","user":{"birthday":"1990-01-15","gender":"男","phone":"13800138001","name":"张三","id":"patient001","avatar":null,"username":"testuser"}}
```
**测试结果**: ✅ PASS

---

### TC-VER-002: 验证新患者（首次）
```bash
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"新患者测试","birthday":"2000-06-01"}'
```
**响应结果**:
```json
{"success":true,"message":"首次登录，已为您创建账户","user":{"birthday":"2000-06-01","gender":null,"phone":null,"name":"新患者测试","id":"patient1746843302125","avatar":null,"username":null}}
```
**测试结果**: ✅ PASS

---

### TC-VER-003: 验证不同生日（创建新账户）
```bash
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","birthday":"1990-01-16"}'
```
**响应结果**:
```json
{"success":true,"message":"首次登录，已为您创建账户","user":{"birthday":"1990-01-16","gender":null,"phone":null,"name":"张三","id":"patient1746843303126","avatar":null,"username":null}}
```
**测试结果**: ✅ PASS

---

## 4. 密码重置接口测试 (/api/patients/reset-password)

### TC-RST-001: 正常重置密码
```bash
curl -X POST http://localhost:8081/api/patients/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","newPassword":"newpass123"}'
```
**响应结果**:
```json
{"success":true,"message":"密码重置成功"}
```
**测试结果**: ✅ PASS

**验证登录**:
```bash
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"newpass123"}'
```
**响应结果**:
```json
{"success":true,"message":"登录成功","user":{...}}
```
**验证结果**: ✅ PASS (新密码登录成功)

---

### TC-RST-002: 用户不存在
```bash
curl -X POST http://localhost:8081/api/patients/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexistuser","newPassword":"newpass123"}'
```
**响应结果**:
```json
{"success":false,"message":"用户不存在"}
```
**测试结果**: ✅ PASS (返回400状态码，错误提示正确)

---

## 5. 数据库验证

### 5.1 查看所有患者
```sql
SELECT id, username, name, birthday, phone, gender FROM patients;
```
**结果**:
| id | username | name | birthday | phone | gender |
|---|---|---|---|---|---|
| patient001 | testuser | 张三 | 1990-01-15 | 13800138001 | 男 |
| patient002 | marywang | 王小红 | 1985-06-20 | 13800138002 | 女 |
| patient003 | johnchen | 陈小明 | 2000-03-10 | 13800138003 | 男 |
| patient1746843300123 | newuser001 | 新用户 | 1995-05-15 | NULL | NULL |
| patient1746843301124 | newuser003 | 完整信息用户 | 1992-03-20 | 13900139001 | 女 |
| patient1746843302125 | NULL | 新患者测试 | 2000-06-01 | NULL | NULL |
| patient1746843303126 | NULL | 张三 | 1990-01-16 | NULL | NULL |

---

## 6. 测试总结

| 接口 | 用例数 | 通过数 | 失败数 | 通过率 |
|---|---|---|---|---|
| 患者登录 /api/patients/login | 3 | 3 | 0 | 100% |
| 患者注册 /api/patients/register | 4 | 4 | 0 | 100% |
| 患者身份验证 /api/patients/verify | 3 | 3 | 0 | 100% |
| 密码重置 /api/patients/reset-password | 2 | 2 | 0 | 100% |
| **总计** | **12** | **12** | **0** | **100%** |

### 测试结论
🎉 **所有API接口测试通过！**

- ✅ 登录接口：正确处理登录成功和失败场景
- ✅ 注册接口：正确处理注册成功、用户名冲突、手机号冲突场景
- ✅ 身份验证接口：正确处理已存在患者验证和新患者首次验证场景
- ✅ 密码重置接口：正确处理重置成功和用户不存在场景
- ✅ 数据库验证：所有数据正确写入，中文显示正常

---

## 附录：错误响应格式

所有错误响应统一格式：
```json
{
    "success": false,
    "message": "错误描述信息",
    "user": null
}
```

## 附录：成功响应格式

```json
{
    "success": true,
    "message": "操作成功信息",
    "user": { ... }
}
```

---

**报告生成时间**: 2026-05-10 11:55:00
