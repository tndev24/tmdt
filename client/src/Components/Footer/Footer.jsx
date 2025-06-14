import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('column')}>
                    <h3 className={cx('title')}>NỘI THẤT MOHO</h3>
                    <p className={cx('description')}>
                        Nội Thất MOHO là thương hiệu đến từ Savimex với gần 40 năm kinh nghiệm trong việc sản xuất và
                        xuất khẩu nội thất đạt chuẩn quốc tế.
                    </p>
                    <div className={cx('certification')}>
                        <img
                            src="https://theme.hstatic.net/200000065946/1001264503/14/logo_bct.png?v=880"
                            alt="Đã thông báo Bộ Công Thương"
                        />
                        <img
                            src="https://images.dmca.com/Badges/dmca_protected_18_120.png?ID=c870a589-fd82-4c14-9e41-c3891ec42fb5"
                            alt="Protected by DMCA"
                        />
                    </div>
                </div>

                <div className={cx('column')}>
                    <h3 className={cx('title')}>DỊCH VỤ</h3>
                    <ul className={cx('service-list')}>
                        <li>
                            <a href="#">Chính Sách Bán Hàng</a>
                        </li>
                        <li>
                            <a href="#">Chính Sách Giao Hàng & Lắp Đặt</a>
                        </li>
                        <li>
                            <a href="#">Chính Sách Bảo Hành & Bảo Trì</a>
                        </li>
                        <li>
                            <a href="#">Chính Sách Đổi Trả</a>
                        </li>
                        <li>
                            <a href="#">Khách Hàng Thân Thiết – MOHOmie</a>
                        </li>
                        <li>
                            <a href="#">Chính Sách Đối Tác Bán Hàng</a>
                        </li>
                    </ul>
                </div>

                <div className={cx('column')}>
                    <h3 className={cx('title')}>THÔNG TIN LIÊN HỆ</h3>
                    <div className={cx('contact-info')}>
                        <div className={cx('location')}>
                            <p className={cx('location-title')}>
                                <strong>[Khu Vực Tp. Hồ Chí Minh]</strong>
                            </p>
                            <p>
                                162 HT17, P. Hiệp Thành, Q. 12, TP. HCM (Nằm trong khuôn viên công ty SAVIMEX phía sau
                                bến xe buýt Hiệp Thành)
                            </p>
                            <p className={cx('hotline')}>Hotline: 0934 608 916</p>
                        </div>

                        <div className={cx('location')}>
                            <p>S05.03-S18 khu The Rainbow | Vinhomes Grand Park, TP. Thủ Đức.</p>
                            <p className={cx('hotline')}>Hotline: 0931 880 424</p>
                        </div>

                        <div className={cx('location')}>
                            <p className={cx('location-title')}>
                                <strong>[Khu Vực Hà Nội]</strong>
                            </p>
                            <p>S3.03-Sh15 khu Sapphire | Vinhomes Smart City, Hà Nội.</p>
                            <p className={cx('hotline')}>Hotline: 0909 665 728</p>
                        </div>

                        <div className={cx('location')}>
                            <p>S2.09-Sh19 khu Sapphire | Vinhomes Ocean Park, Hà Nội.</p>
                            <p className={cx('hotline')}>Hotline: 0938 108 772</p>
                        </div>

                        <div className={cx('phone-email')}>
                            <p>097 114 1140 (Hotline/Zalo)</p>
                            <p>0902 415 359 (Đội Giao Hàng)</p>
                            <p>cskh@moho.com.vn</p>
                        </div>

                        <div className={cx('company-info')}>
                            <p>
                                Công Ty Cổ Phần Hợp Tác Kinh Tế Và Xuất Nhập Khẩu Savimex - STK: 0071001303667 -
                                Vietcombank CN HCM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
