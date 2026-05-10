SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 创建医生表
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(50),
    department VARCHAR(100),
    avatar TEXT,
    experience VARCHAR(100),
    specialties JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入医生数据
INSERT INTO doctors (id, username, password, name, title, department, avatar, experience, specialties, is_active) VALUES
('doc001', 'dr-zhang-wei', '123456', '张伟医生', '主任医师', '心内科', 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400', '15年临床经验', '["高血压", "冠心病", "心律失常"]', TRUE),
('doc002', 'dr-li-na', '123456', '李娜医生', '副主任医师', '儿科', 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400', '10年临床经验', '["儿童感冒", "儿童发育", "疫苗接种"]', TRUE),
('doc003', 'dr-wang-qiang', '123456', '王强医生', '主治医师', '骨科', 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400', '8年临床经验', '["骨折", "关节炎", "运动损伤"]', TRUE),
('doc004', 'dr-liu-min', '123456', '刘敏医生', '主任医师', '妇产科', 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400', '18年临床经验', '["孕期保健", "妇科炎症", "产后恢复"]', FALSE),
('doc005', 'dr-chen-jie', '123456', '陈杰医生', '副主任医师', '消化内科', 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400', '12年临床经验', '["胃炎", "肠道疾病", "肝病"]', TRUE);

-- 创建患者用户表
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE COMMENT '用户名',
    password VARCHAR(255) COMMENT '加密密码',
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    birthday VARCHAR(20) COMMENT '生日',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    gender VARCHAR(10) COMMENT '性别',
    avatar TEXT COMMENT '头像URL',
    status INT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_name_birthday (name, birthday)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='患者用户表';

-- 插入示例患者数据
INSERT INTO patients (id, username, password, name, birthday, phone, gender) VALUES
('patient001', 'testuser', '123456', '张三', '1990-01-15', '13800138001', '男'),
('patient002', 'marywang', '654321', '王小红', '1985-06-20', '13800138002', '女'),
('patient003', 'johnchen', 'abc123', '陈小明', '2000-03-10', '13800138003', '男');
