# 问诊用户API测试文档

## 1. 文档信息

| 项目 | 内容 |
| :--- | :--- |
| **文档版本** | V1.0 |
| **创建日期** | 2026-05-10 |
| **作者** | 测试团队 |
| **测试环境** | http://localhost:8081 |
| **所属项目** | QA Live Healthcare Interview |

---

## 2. 测试概述

本文档描述问诊用户模块所有API接口的测试流程，包括：
- 患者登录接口
- 患者注册接口
- 患者身份验证接口
- 密码重置接口

### 2.1 测试环境

| 配置项 | 值 |
| :--- | :--- |
| 后端服务地址 | http://localhost:8081 |
| 数据库地址 | localhost:3306 |
| 数据库名称 | qa_db |
| 测试用户 | testuser / 123456 |

---

## 3. 接口测试用例

### 3.1 患者登录接口

**接口信息：**
- **路径**: `/api/patients/login`
- **方法**: POST
- **Content-Type**: application/json

**测试用例：**

| 用例编号 | 测试场景 | 请求体 | 预期状态码 | 预期结果 |
| :--- | :--- | :--- | :--- | :--- |
| TC-LOGIN-001 | 正确用户名密码登录 | `{"username":"testuser","password":"123456"}` | 200 | `{"success":true,"message":"登录成功"}` |
| TC-LOGIN-002 | 错误用户名登录 | `{"username":"nonexist","password":"123456"}` | 401 | `{"success":false,"message":"用户名或密码错误"}` |
| TC-LOGIN-003 | 错误密码登录 | `{"username":"testuser","password":"wrongpass"}` | 401 | `{"success":false,"message":"用户名或密码错误"}` |
| TC-LOGIN-004 | 空用户名登录 | `{"username":"","password":"123456"}` | 401 | `{"success":false,"message":"用户名或密码错误"}` |
| TC-LOGIN-005 | 空密码登录 | `{"username":"testuser","password":""}` | 401 | `{"success":false,"message":"用户名或密码错误"}` |
| TC-LOGIN-006 | 用户名不存在 | `{"username":"nouser","password":"123456"}` | 401 | `{"success":false,"message":"用户名或密码错误"}` |

**CURL测试命令：**

```bash
# TC-LOGIN-001: 正确用户名密码登录
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'

# TC-LOGIN-002: 错误用户名登录
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexist","password":"123456"}'

# TC-LOGIN-003: 错误密码登录
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"wrongpass"}'

# TC-LOGIN-004: 空用户名登录
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"","password":"123456"}'

# TC-LOGIN-005: 空密码登录
curl -X POST http://localhost:8081/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":""}'
```

---

### 3.2 患者注册接口

**接口信息：**
- **路径**: `/api/patients/register`
- **方法**: POST
- **Content-Type**: application/json

**测试用例：**

| 用例编号 | 测试场景 | 请求体 | 预期状态码 | 预期结果 |
| :--- | :--- | :--- | :--- | :--- |
| TC-REG-001 | 正常注册新用户 | `{"username":"newuser001","password":"pass123","name":"新用户","birthday":"1995-05-15"}` | 201 | `{"success":true,"message":"注册成功"}` |
| TC-REG-002 | 用户名已存在 | `{"username":"testuser","password":"pass123","name":"测试","birthday":"1990-01-01"}` | 400 | `{"success":false,"message":"用户名已存在"}` |
| TC-REG-003 | 手机号已注册 | `{"username":"newuser002","password":"pass123","name":"测试","birthday":"1990-01-01","phone":"13800138001"}` | 400 | `{"success":false,"message":"手机号已被注册"}` |
| TC-REG-004 | 注册时填写完整信息 | `{"username":"newuser003","password":"pass123","name":"完整信息用户","birthday":"1992-03-20","phone":"13900139001","gender":"女"}` | 201 | `{"success":true,"message":"注册成功"}` |

**CURL测试命令：**

```bash
# TC-REG-001: 正常注册新用户
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser001","password":"pass123","name":"新用户","birthday":"1995-05-15"}'

# TC-REG-002: 用户名已存在
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123","name":"测试","birthday":"1990-01-01"}'

# TC-REG-003: 手机号已注册
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser002","password":"pass123","name":"测试","birthday":"1990-01-01","phone":"13800138001"}'

# TC-REG-004: 注册时填写完整信息
curl -X POST http://localhost:8081/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser003","password":"pass123","name":"完整信息用户","birthday":"1992-03-20","phone":"13900139001","gender":"女"}'
```

---

### 3.3 患者身份验证接口

**接口信息：**
- **路径**: `/api/patients/verify`
- **方法**: POST
- **Content-Type**: application/json

**测试用例：**

| 用例编号 | 测试场景 | 请求体 | 预期状态码 | 预期结果 |
| :--- | :--- | :--- | :--- | :--- |
| TC-VER-001 | 验证已存在患者 | `{"name":"张三","birthday":"1990-01-15"}` | 200 | `{"success":true,"message":"验证成功"}` |
| TC-VER-002 | 验证新患者（首次） | `{"name":"新患者测试","birthday":"2000-06-01"}` | 200 | `{"success":true,"message":"首次登录，已为您创建账户"}` |
| TC-VER-003 | 验证不同生日 | `{"name":"张三","birthday":"1990-01-16"}` | 200 | `{"success":true}` (创建新账户) |
| TC-VER-004 | 空姓名验证 | `{"name":"","birthday":"1990-01-15"}` | 200 | `{"success":true}` (创建新账户) |

**CURL测试命令：**

```bash
# TC-VER-001: 验证已存在患者
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","birthday":"1990-01-15"}'

# TC-VER-002: 验证新患者（首次）
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"新患者测试","birthday":"2000-06-01"}'

# TC-VER-003: 验证不同生日
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","birthday":"1990-01-16"}'

# TC-VER-004: 空姓名验证
curl -X POST http://localhost:8081/api/patients/verify \
  -H "Content-Type: application/json" \
  -d '{"name":"","birthday":"1990-01-15"}'
```

---

### 3.4 密码重置接口

**接口信息：**
- **路径**: `/api/patients/reset-password`
- **方法**: POST
- **Content-Type**: application/json

**测试用例：**

| 用例编号 | 测试场景 | 请求体 | 预期状态码 | 预期结果 |
| :--- | :--- | :--- | :--- | :--- |
| TC-RST-001 | 正常重置密码 | `{"username":"testuser","newPassword":"newpass123"}` | 200 | `{"success":true,"message":"密码重置成功"}` |
| TC-RST-002 | 用户不存在 | `{"username":"nonexist","newPassword":"newpass123"}` | 400 | `{"success":false,"message":"用户不存在"}` |
| TC-RST-003 | 空用户名 | `{"username":"","newPassword":"newpass123"}` | 400 | `{"success":false}` |

**CURL测试命令：**

```bash
# TC-RST-001: 正常重置密码
curl -X POST http://localhost:8081/api/patients/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","newPassword":"newpass123"}'

# TC-RST-002: 用户不存在
curl -X POST http://localhost:8081/api/patients/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username":"nonexist","newPassword":"newpass123"}'

# TC-RST-003: 空用户名
curl -X POST http://localhost:8081/api/patients/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username":"","newPassword":"newpass123"}'
```

---

## 4. 测试执行指南

### 4.1 前置条件

1. 确保Docker服务正在运行：
```bash
docker ps | grep qa-mysql
```

2. 确保后端服务正在运行：
```bash
curl http://localhost:8081/api/doctors
```

### 4.2 执行测试

```bash
# 创建测试报告目录
mkdir -p docs/test-reports

# 执行登录接口测试
echo "=== 患者登录接口测试 ===" > docs/test-reports/api_test_report.md
./test_login_api.sh >> docs/test-reports/api_test_report.md 2>&1

# 执行注册接口测试
echo "=== 患者注册接口测试 ===" >> docs/test-reports/api_test_report.md
./test_register_api.sh >> docs/test-reports/api_test_report.md 2>&1

# 执行身份验证接口测试
echo "=== 患者身份验证接口测试 ===" >> docs/test-reports/api_test_report.md
./test_verify_api.sh >> docs/test-reports/api_test_report.md 2>&1

# 执行密码重置接口测试
echo "=== 密码重置接口测试 ===" >> docs/test-reports/api_test_report.md
./test_reset_api.sh >> docs/test-reports/api_test_report.md 2>&1
```

### 4.3 一键执行脚本

```bash
#!/bin/bash

# API测试脚本 - 一键执行所有测试

echo "=========================================="
echo "  问诊用户API测试报告"
echo "  测试时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

# 测试结果计数器
PASS=0
FAIL=0

# 测试函数
test_api() {
    local name=$1
    local expected=$2
    local response=$(eval "$3")
    local expected_code=$4

    echo "----------------------------------------"
    echo "测试: $name"
    echo "命令: $3"
    echo "响应: $response"
    echo "预期: $expected"
    echo ""

    if [[ $response == *"$expected"* ]]; then
        echo "结果: ✅ PASS"
        ((PASS++))
    else
        echo "结果: ❌ FAIL"
        ((FAIL++))
    fi
    echo ""
}

# 1. 登录接口测试
echo "=== 1. 患者登录接口测试 ==="
test_api "正确用户名密码" "success\":true" \
    "curl -s -X POST http://localhost:8081/api/patients/login -H 'Content-Type: application/json' -d '{\"username\":\"testuser\",\"password\":\"123456\"}'" \
    "200"

test_api "错误用户名" "success\":false" \
    "curl -s -X POST http://localhost:8081/api/patients/login -H 'Content-Type: application/json' -d '{\"username\":\"nonexist\",\"password\":\"123456\"}'" \
    "401"

test_api "错误密码" "success\":false" \
    "curl -s -X POST http://localhost:8081/api/patients/login -H 'Content-Type: application/json' -d '{\"username\":\"testuser\",\"password\":\"wrongpass\"}'" \
    "401"

# 2. 注册接口测试
echo ""
echo "=== 2. 患者注册接口测试 ==="

# 生成唯一用户名避免冲突
UNIQUE_USER="testuser_$(date +%s)"
test_api "正常注册新用户" "success\":true" \
    "curl -s -X POST http://localhost:8081/api/patients/register -H 'Content-Type: application/json' -d '{\"username\":\"$UNIQUE_USER\",\"password\":\"pass123\",\"name\":\"测试用户\",\"birthday\":\"1995-05-15\"}'" \
    "201"

test_api "用户名已存在" "success\":false" \
    "curl -s -X POST http://localhost:8081/api/patients/register -H 'Content-Type: application/json' -d '{\"username\":\"testuser\",\"password\":\"pass123\",\"name\":\"测试\",\"birthday\":\"1990-01-01\"}'" \
    "400"

# 3. 身份验证接口测试
echo ""
echo "=== 3. 患者身份验证接口测试 ==="
test_api "验证已存在患者" "success\":true" \
    "curl -s -X POST http://localhost:8081/api/patients/verify -H 'Content-Type: application/json' -d '{\"name\":\"张三\",\"birthday\":\"1990-01-15\"}'" \
    "200"

# 4. 密码重置接口测试
echo ""
echo "=== 4. 密码重置接口测试 ==="
test_api "正常重置密码" "success\":true" \
    "curl -s -X POST http://localhost:8081/api/patients/reset-password -H 'Content-Type: application/json' -d '{\"username\":\"testuser\",\"newPassword\":\"123456\"}'" \
    "200"

test_api "用户不存在" "success\":false" \
    "curl -s -X POST http://localhost:8081/api/patients/reset-password -H 'Content-Type: application/json' -d '{\"username\":\"nonexistuser\",\"newPassword\":\"newpass123\"}'" \
    "400"

# 测试总结
echo ""
echo "=========================================="
echo "  测试总结"
echo "=========================================="
echo "通过: $PASS"
echo "失败: $FAIL"
echo "总计: $((PASS + FAIL))"
echo ""
if [ $FAIL -eq 0 ]; then
    echo "🎉 所有测试通过!"
else
    echo "⚠️  有 $FAIL 个测试失败，请检查。"
fi
```

---

## 5. 数据库验证查询

### 5.1 验证患者数据

```sql
-- 查看所有患者
SELECT id, username, name, birthday, phone, gender FROM patients;

-- 查看特定患者
SELECT * FROM patients WHERE username = 'testuser';

-- 统计患者数量
SELECT COUNT(*) as total_patients FROM patients;
```

### 5.2 验证操作结果

```bash
# 查看患者数据
docker exec qa-mysql mysql -u qa_user -pqa_password qa_db -e "SELECT id, username, name, birthday FROM patients"

# 查看测试后新增的患者
docker exec qa-mysql mysql -u qa_user -pqa_password qa_db -e "SELECT id, username, name, birthday, created_at FROM patients ORDER BY created_at DESC LIMIT 5"
```

---

## 6. 附录

### 6.1 错误响应格式

所有接口在发生错误时统一返回以下格式：

```json
{
    "success": false,
    "message": "错误描述信息",
    "user": null
}
```

### 6.2 成功响应格式

```json
{
    "success": true,
    "message": "操作成功信息",
    "user": { ... }
}
```

### 6.3 HTTP状态码说明

| 状态码 | 说明 |
| :--- | :--- |
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/认证失败 |
| 500 | 服务器内部错误 |

---

**文档结束**
