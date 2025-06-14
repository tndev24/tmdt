import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Row, Col, Card, Typography, Space, Divider, AutoComplete, message } from 'antd';
import { HomeOutlined, PhoneOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import styles from './CheckOut.module.scss';
import classNames from 'classnames/bind';
import { useStore } from '../../hooks/userStore';

import axios from 'axios';
import useDebounce from '../../hooks/useDebounce';
import { requestCreatePayment, requestUpdateInfoCart } from '../../config/request';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

function CheckOut() {
    const [form] = Form.useForm();
    const [addressOptions, setAddressOptions] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');

    const debounce = useDebounce(address, 500);

    useEffect(() => {
        if (debounce) {
            onAddressSearch(debounce);
        }
    }, [debounce]);

    useEffect(() => {
        document.title = 'Thanh Toán';
    }, []);

    const { dataCart, getCart } = useStore();
    // Mock order data (would normally come from cart or context)
    const orderItems = dataCart?.cartItems?.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item?.product.discount
            ? item?.product.price - (item?.product.discount * item?.product.price) / 100
            : item?.product.price,
        quantity: item.item.quantity,
        image: item?.product.images.split(',')[0],
    }));

    const onAddressSearch = (value) => {
        if (!value || value.length < 3) {
            setAddressOptions([]);
            return;
        }

        // In a real application, this would make an API call to fetch address suggestions
        setTimeout(async () => {
            const response = await axios.get('https://rsapi.goong.io/Place/AutoComplete', {
                params: {
                    input: value,
                    api_key: 'oAyJuGlP3ylS5UGBA3HgpppFgwaBhPUUrP7Xv5Ak',
                },
            });

            const data = response.data.predictions;

            setAddressOptions(data);
        }, 300); // Simulate network delay
    };

    const navigate = useNavigate();

    const onFinish = async (values) => {
        const data = {
            fullName: values.fullName,
            phone: values.phone,
            address: values.address,
            note: values.notes,
            totalPrice: dataCart?.totalPrice,
            typePayment: paymentMethod,
        };

        await requestUpdateInfoCart(data);
        if (paymentMethod === 'COD') {
            const res = await requestCreatePayment(data);
            await getCart();
            navigate(`/payments/${res.metadata._id}`);
        }
        if (paymentMethod === 'VNPAY') {
            const res = await requestCreatePayment(data);
            window.open(res.metadata, '_blank');
        }
        if (paymentMethod === 'MOMO') {
            const res = await requestCreatePayment(data);
            window.open(res.metadata, '_blank');
        }
    };

    // Payment method icons
    const paymentIcons = {
        COD: <DollarOutlined style={{ fontSize: '24px', color: '#108ee9' }} />,
        VNPAY: (
            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPAY" height="24" />
        ),
        MOMO: <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" height="24" />,
    };

    return (
        <div className={cx('checkout-page')}>
            <header>
                <Header />
            </header>

            <main className={cx('checkout-container')}>
                <Title level={2} className={cx('checkout-title')}>
                    Thanh Toán
                </Title>

                <Form
                    form={form}
                    name="checkout"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ payment_method: 'COD' }}
                    scrollToFirstError
                >
                    <Row gutter={[32, 24]}>
                        {/* Left Column - Customer Information */}
                        <Col xs={24} lg={12}>
                            <Card title="Thông tin giao hàng" bordered={false}>
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                >
                                    <AutoComplete
                                        options={addressOptions.map((item) => ({
                                            value: item.description,
                                        }))}
                                        placeholder="Nhập địa chỉ của bạn"
                                        style={{ width: '100%' }}
                                        onChange={(value) => setAddress(value)}
                                    >
                                        <Input prefix={<HomeOutlined />} />
                                    </AutoComplete>
                                </Form.Item>

                                <Form.Item name="notes" label="Ghi chú">
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                    />
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* Right Column - Order Summary & Payment */}
                        <Col xs={24} lg={12}>
                            <Card title="Đơn hàng của bạn" bordered={false}>
                                <div className={cx('order-items')}>
                                    {orderItems?.map((item) => (
                                        <div key={item.id} className={cx('order-item')}>
                                            <div className={cx('item-info')}>
                                                <img className={cx('item-image')} src={item.image} alt={item.name} />
                                                <Text strong>{item.name}</Text>
                                                <Text type="secondary">Số lượng : x {item.quantity}</Text>
                                            </div>
                                            <Text>{item.price?.toLocaleString('vi-VN')}₫</Text>
                                        </div>
                                    ))}
                                </div>

                                <Divider />

                                <div className={cx('order-summary')}>
                                    <div className={cx('summary-row', 'total')}>
                                        <Text strong>Tổng cộng</Text>
                                        <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
                                            {dataCart?.totalPrice?.toLocaleString('vi-VN')}₫
                                        </Text>
                                    </div>
                                </div>

                                <Divider />

                                <Form.Item
                                    name="payment_method"
                                    label="Phương thức thanh toán"
                                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                                >
                                    <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Radio value="COD">
                                                <div className={cx('payment-option')}>
                                                    {paymentIcons.COD}
                                                    <span className={cx('payment-label')}>
                                                        Thanh toán khi nhận hàng (COD)
                                                    </span>
                                                </div>
                                            </Radio>
                                            <Radio value="VNPAY">
                                                <div className={cx('payment-option')}>
                                                    {paymentIcons.VNPAY}
                                                    <span className={cx('payment-label')}>Thanh toán qua VNPAY</span>
                                                </div>
                                            </Radio>
                                            <Radio value="MOMO">
                                                <div className={cx('payment-option')}>
                                                    {paymentIcons.MOMO}
                                                    <span className={cx('payment-label')}>Thanh toán qua Ví MoMo</span>
                                                </div>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                                    Đặt hàng
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default CheckOut;
