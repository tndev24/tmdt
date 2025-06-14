import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import {
    requestCreateProduct,
    requestDeleteProduct,
    requestGetAllCategory,
    requestGetAllProduct,
    requestUpdateProduct,
    requestUploadImage,
} from '../../../../config/request';

function ManagerProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await requestGetAllCategory();
            setCategories(response.metadata);
        };
        fetchCategories();
    }, []);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const response = await requestGetAllProduct();
            setProducts(response.metadata);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu sản phẩm');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle form submission
    const handleSubmit = async (values) => {
        form.validateFields();
        try {
            let imageUrls = [];

            // Handle image uploads only if there are new images
            const newImages = fileList.filter((file) => file.originFileObj);
            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach((file) => {
                    formData.append('images', file.originFileObj);
                });
                const resImages = await requestUploadImage(formData);

                // Combine new uploaded images with existing images
                const existingImages = fileList.filter((file) => !file.originFileObj).map((file) => file.url);
                imageUrls = [...existingImages, ...resImages.images];
            } else {
                // Keep existing images if no new uploads
                imageUrls = fileList.map((file) => file.url);
            }

            const formData = {
                ...values,
                images: imageUrls.join(','),
                description: editorContent,
            };

            if (editingId) {
                // Update existing product
                formData.id = editingId;
                await requestUpdateProduct(formData);
                message.success('Cập nhật sản phẩm thành công');
            } else {
                // Create new product
                await requestCreateProduct(formData);
                message.success('Thêm sản phẩm thành công');
            }

            // Reset and refresh
            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra');
            console.error(error);
        }
    };

    // Delete a product
    const handleDelete = async (id) => {
        try {
            await requestDeleteProduct(id);
            message.success('Xóa sản phẩm thành công');
            fetchProducts();
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
            console.error(error);
        }
    };

    // Edit a product
    const handleEdit = (record) => {
        setEditingId(record._id);
        form.setFieldsValue({
            name: record.name,
            price: record.price,
            discount: record.discount,
            description: record.description,
            category: record.categoryId,
            size: record.size,
            stock: record.stock,
        });

        // Set image files
        if (record.images && record.images.length > 0) {
            const imageFiles = record.images.split(',').map((url, index) => ({
                uid: `-${index}`,
                name: `image-${index}.jpg`,
                status: 'done',
                url,
            }));
            setFileList(imageFiles);
        }

        setModalVisible(true);
    };

    // Add new product
    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setFileList([]);
        setModalVisible(true);
    };

    // Upload props

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            return false; // Prevent auto upload
        },
        onChange: (info) => {
            setFileList(info.fileList);
        },
        fileList,
        multiple: true,
    };

    // Table columns
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => new Intl.NumberFormat('vi-VN').format(price),
        },
        {
            title: 'Giảm giá (%)',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="manager-product" style={{ padding: '20px' }}>
            <div
                className="header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
            >
                <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Quản lý sản phẩm</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                    Thêm sản phẩm
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="_id"
                loading={loading}
                pagination={{ defaultPageSize: 10, showSizeChanger: true }}
                bordered
            />

            <Modal
                title={editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Giảm giá (%)"
                        rules={[{ required: true, message: 'Vui lòng nhập % giảm giá' }]}
                    >
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                        <Select>
                            {categories.map((category) => (
                                <Select.Option value={category._id}>{category.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="size"
                        label="Kích thước"
                        rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}
                    >
                        <Input placeholder="VD: 80x60x120cm" />
                    </Form.Item>

                    <Form.Item
                        name="stock"
                        label="Tồn kho"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Editor
                            apiKey="hfm046cu8943idr5fja0r5l2vzk9l8vkj5cp3hx2ka26l84x"
                            init={{
                                plugins:
                                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar:
                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            initialValue="Welcome to TinyMCE!"
                            onEditorChange={(content, editor) => {
                                setEditorContent(content);
                                form.setFieldsValue({ description: content });
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Hình ảnh" required>
                        <Upload multiple listType="picture-card" {...uploadProps}>
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManagerProduct;
