import classNames from 'classnames/bind';
import styles from './Options.module.scss';

const cx = classNames.bind(styles);

function Options() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('option')}>
                <img src="https://theme.hstatic.net/200000065946/1001264503/14/vice_item_1_thumb.png?v=880" alt="" />
                <h3>Giao hàng & lắp đặt</h3>
                <p>Miễn phí</p>
            </div>

            <div className={cx('option')}>
                <img src="https://theme.hstatic.net/200000065946/1001264503/14/vice_item_2_thumb.png?v=880" alt="" />
                <h3>Đổi trả 1 - 1</h3>
                <p>Miễn phí</p>
            </div>

            <div className={cx('option')}>
                <img src="https://theme.hstatic.net/200000065946/1001264503/14/vice_item_3_thumb.png?v=880" alt="" />
                <h3>Bảo hành 2 năm</h3>
                <p>Miễn phí</p>
            </div>

            <div className={cx('option')}>
                <img src="https://theme.hstatic.net/200000065946/1001264503/14/vice_item_4_thumb.png?v=880" alt="" />
                <h3>Tư vấn miễn phí</h3>
                <p>Miễn phí</p>
            </div>
        </div>
    );
}

export default Options;
