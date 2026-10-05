# 📦 Entities — CGV Cinema Booking System

Thư mục này chứa toàn bộ **TypeORM entities** của hệ thống đặt vé rạp phim,
được thiết kế tham khảo theo mô hình nghiệp vụ của [CGV Việt Nam](https://www.cgv.vn/).

---

## 📁 Danh sách Entity

| File | Entity | Bảng DB | Mô tả |
|------|--------|---------|-------|
| `movie.entity.ts` | `MovieEntity` | `movie` | Thông tin phim |
| `format.entity.ts` | `FormatEntity` | `format` | Định dạng chiếu (2D, 3D, IMAX...) |
| `cinema.entity.ts` | `CinemaEntity` | `cinema` | Cụm rạp chiếu phim |
| `room.entity.ts` | `RoomEntity` | `room` | Phòng chiếu trong rạp |
| `seat.entity.ts` | `SeatEntity` | `seat` | Ghế ngồi trong phòng chiếu |
| `showtime.entity.ts` | `ShowtimeEntity` | `showtime` | Suất chiếu |
| `combo.entity.ts` | `ComboEntity` | `combo` | Bắp nước / Combo đồ ăn |
| `promotion.entity.ts` | `PromotionEntity` | `promotion` | Khuyến mãi / Voucher |
| `user.entity.ts` | `UserEntity` | `users` | Tài khoản người dùng |
| `membership.entity.ts` | `MembershipEntity` | `membership` | Thẻ hội viên CGV |
| `point-transaction.entity.ts` | `PointTransactionEntity` | `point_transaction` | Lịch sử CGV Point |
| `booking.entity.ts` | `BookingEntity` | `booking` | Đơn đặt vé |
| `booking-detail.entity.ts` | `BookingDetailEntity` | `booking_detail` | Chi tiết ghế trong đơn vé |
| `booking-combo.entity.ts` | `BookingComboEntity` | `booking_combo` | Combo được chọn trong đơn vé |
| `payment.entity.ts` | `PaymentEntity` | `payment` | Giao dịch thanh toán |

---

## 🗂️ Sơ đồ quan hệ (ERD)

```
┌──────────┐      ┌───────────┐      ┌────────┐      ┌─────────┐
│  Movie   │──1:N─│ Showtime  │──N:1─│  Room  │──N:1─│ Cinema  │
└──────────┘      └───────────┘      └────────┘      └─────────┘
                        │                │
                        │                └──1:N──┐
                        │                        │
                       N:1                  ┌──────────┐
                        │                  │   Seat   │
                  ┌───────────┐            └──────────┘
                  │  Booking  │──1:N──────────────┘ (BookingDetail)
                  └───────────┘
                   │   │   │
          ┌────────┘   │   └────────────────────────┐
          │            │                             │
     ┌─────────┐  ┌───────────┐             ┌──────────────┐
     │ Payment │  │ Promotion │             │ BookingCombo │──N:1──┐
     └─────────┘  └───────────┘             └──────────────┘       │
                                                               ┌───────┐
┌──────┐   1:1   ┌────────────┐   1:N   ┌──────────────────┐  │ Combo │
│ User │────────│ Membership │────────│ PointTransaction  │  └───────┘
└──────┘         └────────────┘         └──────────────────┘
```

---

## 📋 Chi tiết từng Entity

### 🎬 MovieEntity
Lưu thông tin phim đang chiếu và sắp chiếu.

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Tên phim |
| `description` | `text` | Mô tả nội dung phim |
| `duration` | `number` | Thời lượng (phút) |
| `rated` | `string` | Phân loại độ tuổi (P, C13, C16, C18) |
| `release_date` | `Date` | Ngày khởi chiếu |
| `languages` | `string[]` | Ngôn ngữ gốc |
| `countries` | `string[]` | Quốc gia sản xuất |
| `genres` | `string[]` | Thể loại (Hành động, Hài, Kinh dị...) |
| `directors` | `string[]` | Đạo diễn |
| `actors` | `string[]` | Diễn viên |
| `trailer_url` | `string?` | Link trailer |
| `poster_url` | `string?` | Ảnh poster |
| `is_active` | `boolean` | Đang hiển thị |
| `display_order` | `number` | Thứ tự sắp xếp |

---

### 🎞️ FormatEntity
Định dạng công nghệ chiếu phim.

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Tên định dạng (2D, 3D, IMAX 2D, 4DX 3D, ScreenX...) |
| `description` | `string` | Mô tả công nghệ |
| `price` | `number` | Giá phụ thu thêm |
| `is_active` | `boolean` | Đang áp dụng |

---

### 🏢 CinemaEntity
Thông tin cụm rạp chiếu phim.

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Tên rạp (VD: CGV Vincom Center) |
| `address` | `string` | Địa chỉ |
| `ward` | `string?` | Phường/Quận |
| `city` | `string?` | Tỉnh/Thành phố |
| `phone` | `string` | Số điện thoại |
| `hotline` | `string?` | Hotline |
| `fax` | `string?` | Fax |
| `image_urls` | `string[]?` | Ảnh rạp |
| `description` | `text?` | Mô tả |
| `lat` / `long` | `float?` | Tọa độ GPS |
| `link_ggmap` | `string?` | Link Google Maps |
| `is_active` | `boolean` | Đang hoạt động |
| `rooms` | `RoomEntity[]` | Danh sách phòng chiếu |

---

### 🪑 RoomEntity
Phòng chiếu trong một cụm rạp.

**Enum `ERoomType`:** `imax` · `4dx` · `ultra_4dx` · `starium` · `infinity` · `golden_class` · `lamour` · `sweet_box` · `standard_2d` · `standard_3d`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Tên phòng (VD: Hall 1) |
| `cinema_id` | `string` | FK → Cinema |
| `roomType` | `ERoomType` | Loại phòng chiếu |
| `seats` | `SeatEntity[]` | Danh sách ghế |

---

### 💺 SeatEntity
Ghế ngồi trong phòng chiếu.

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `room_id` | `string` | FK → Room |
| `row` | `string` | Hàng (A, B, C...) |
| `col` | `string` | Cột (01, 02...) |
| `type` | `string` | Loại ghế (standard, vip, sweetbox, bed) |
| `price` | `number` | Giá ghế |
| `is_book` | `boolean` | Đã đặt chưa |

---

### 🕐 ShowtimeEntity
Suất chiếu — liên kết Phim và Phòng chiếu với thời gian cụ thể.

**Enum `EShowtimeStatus`:** `upcoming` · `open` · `full` · `ended` · `cancelled`

**Enum `ESubtitleType`:** `subtitled` · `dubbed` · `original`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `movie_id` | `string` | FK → Movie |
| `room_id` | `string` | FK → Room |
| `start_time` | `Date` | Giờ bắt đầu chiếu |
| `end_time` | `Date` | Giờ kết thúc chiếu |
| `language` | `string` | Ngôn ngữ (vi, en, ko...) |
| `subtitle_type` | `ESubtitleType?` | Loại phụ đề |
| `base_price` | `decimal` | Giá vé cơ bản |
| `status` | `EShowtimeStatus` | Trạng thái suất chiếu |

---

### 🍿 ComboEntity
Bắp nước và combo đồ ăn thức uống tại rạp.

**Enum `EComboCategory`:** `popcorn` · `drink` · `combo` · `snack` · `meal` · `gift`

**Enum `EComboSize`:** `S` · `M` · `L` · `XL`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Tên combo |
| `description` | `text?` | Mô tả |
| `category` | `EComboCategory` | Loại (bắp, nước, combo...) |
| `size` | `EComboSize?` | Kích cỡ |
| `price` | `decimal` | Giá |
| `image_url` | `string?` | Ảnh sản phẩm |
| `is_e_combo` | `boolean` | Là e-Combo (đặt trước online) |
| `is_available` | `boolean` | Còn bán |

---

### 🎁 PromotionEntity
Chương trình khuyến mãi, mã voucher, sự kiện ưu đãi.

**Enum `EPromotionType`:** `percentage` · `fixed_amount` · `free_combo` · `buy_x_get_y` · `gift_card`

**Enum `EPromotionScope`:** `all` · `ticket_only` · `combo_only` · `specific_movie` · `specific_cinema` · `specific_day`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Tên chương trình |
| `code` | `string?` | Mã voucher (unique) |
| `type` | `EPromotionType` | Loại khuyến mãi |
| `scope` | `EPromotionScope` | Phạm vi áp dụng |
| `discount_value` | `decimal` | Giá trị giảm (% hoặc VNĐ) |
| `max_discount_amount` | `decimal?` | Giảm tối đa (với loại %) |
| `min_order_amount` | `decimal?` | Đơn hàng tối thiểu |
| `start_date` / `end_date` | `Date` | Thời gian áp dụng |
| `usage_limit` | `number?` | Giới hạn số lượt dùng |
| `per_user_limit` | `number?` | Giới hạn mỗi user |
| `applicable_movie_ids` | `string[]?` | Chỉ áp dụng cho phim cụ thể |
| `applicable_cinema_ids` | `string[]?` | Chỉ áp dụng cho rạp cụ thể |

---

### 👤 UserEntity
Tài khoản người dùng đăng ký trên hệ thống.

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `name` | `string` | Họ tên |
| `email` | `string` | Email đăng nhập |
| `phone` | `string` | Số điện thoại |
| `password` | `string` | Mật khẩu đã hash |
| `salt` | `string` | Salt mã hóa |
| `dob` | `Date?` | Ngày sinh |
| `province` | `string` | Tỉnh/Thành phố |
| `avatar` | `string?` | Ảnh đại diện |
| `sex` | `boolean?` | Giới tính (true = Nam, false = Nữ) |
| `is_active` | `boolean` | Tài khoản đang hoạt động |

---

### 🏅 MembershipEntity
Thẻ hội viên CGV — quản lý tier và điểm thưởng.

**Enum `EMembershipTier`:** `standard` · `vip` · `vvip`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `user_id` | `string` | FK → User (1-1) |
| `member_code` | `string` | Mã thẻ hội viên (unique) |
| `tier` | `EMembershipTier` | Hạng hội viên |
| `cgv_points` | `number` | Điểm hiện có |
| `total_points_earned` | `number` | Tổng điểm tích lũy (để xét lên tier) |
| `tier_expiry_date` | `Date?` | Hạn tier VIP/VVIP |

---

### 💳 PointTransactionEntity
Lịch sử biến động CGV Point của hội viên.

**Enum `EPointTransactionType`:** `earn` · `redeem` · `expire` · `adjust` · `bonus` · `refund`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `membership_id` | `string` | FK → Membership |
| `type` | `EPointTransactionType` | Loại giao dịch điểm |
| `points` | `number` | Điểm thay đổi (+/-) |
| `balance_after` | `number` | Số dư sau giao dịch |
| `reference_id` | `string?` | ID booking/promotion liên quan |
| `expire_at` | `Date?` | Ngày điểm hết hạn |

---

### 🎟️ BookingEntity
Đơn đặt vé — trung tâm của luồng nghiệp vụ.

**Enum `EBookingStatus`:** `pending` · `confirmed` · `cancelled` · `expired` · `refunded`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `booking_code` | `string` | Mã đặt vé (unique, VD: CGV2024001234) |
| `user_id` | `string` | FK → User |
| `showtime_id` | `string` | FK → Showtime |
| `ticket_total` | `decimal` | Tổng tiền vé |
| `combo_total` | `decimal` | Tổng tiền combo |
| `discount_amount` | `decimal` | Số tiền được giảm |
| `final_amount` | `decimal` | Thực thanh toán |
| `promotion_id` | `string?` | FK → Promotion (nếu có) |
| `status` | `EBookingStatus` | Trạng thái đơn |
| `expired_at` | `Date?` | Hết hạn thanh toán (thường 15 phút) |
| `points_earned` | `number` | CGV Point tích từ đơn này |
| `points_used` | `number` | CGV Point dùng để giảm giá |

---

### 🪑 BookingDetailEntity
Chi tiết từng ghế trong một đơn đặt vé.

**Enum `ETicketStatus`:** `active` · `used` · `cancelled`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `booking_id` | `string` | FK → Booking |
| `seat_id` | `string` | FK → Seat |
| `seat_label` | `string` | Nhãn ghế tại lúc đặt (VD: "B05") |
| `seat_type` | `string` | Loại ghế tại lúc đặt (snapshot) |
| `price` | `decimal` | Giá vé tại lúc đặt (snapshot) |
| `status` | `ETicketStatus` | Trạng thái vé |
| `qr_code` | `string?` | QR code soát vé tại cổng rạp |

> **Lưu ý:** `seat_label`, `seat_type`, `price` là **snapshot** — không bị ảnh hưởng nếu dữ liệu gốc thay đổi sau này.

---

### 🍿 BookingComboEntity
Combo đồ ăn thức uống được chọn trong đơn vé.

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `booking_id` | `string` | FK → Booking |
| `combo_id` | `string` | FK → Combo |
| `quantity` | `number` | Số lượng |
| `unit_price` | `decimal` | Đơn giá tại lúc đặt (snapshot) |
| `subtotal` | `decimal` | quantity × unit_price |

---

### 💰 PaymentEntity
Giao dịch thanh toán cho một đơn vé.

**Enum `EPaymentMethod`:** `credit_card` · `momo` · `zalopay` · `vnpay` · `banking` · `cgv_giftcard` · `cgv_point` · `cash` · `shopeepay`

**Enum `EPaymentStatus`:** `pending` · `success` · `failed` · `refunded`

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `booking_id` | `string` | FK → Booking |
| `method` | `EPaymentMethod` | Phương thức thanh toán |
| `amount` | `decimal` | Số tiền thanh toán |
| `status` | `EPaymentStatus` | Trạng thái giao dịch |
| `transaction_id` | `string?` | ID từ cổng thanh toán bên ngoài |
| `gateway_response` | `string?` | Response raw từ cổng (JSON) |
| `paid_at` | `Date?` | Thời điểm thanh toán thành công |

---

## 🔗 Luồng nghiệp vụ chính

```
User chọn Phim
    └─► Chọn Showtime (Movie × Room × Thời gian)
            └─► Chọn Seat(s) trong Room
                    └─► Chọn Combo (tùy chọn)
                            └─► Áp mã Promotion (tùy chọn)
                                    └─► Tạo Booking
                                            ├─ BookingDetail (mỗi ghế)
                                            ├─ BookingCombo  (mỗi combo)
                                            └─► Thanh toán → Payment
                                                    └─► Tích CGV Point → Membership
```

---

## 🏗️ Base Entity

Tất cả entity kế thừa từ `BaseTimeStampEntity`:

```typescript
class BaseTimeStampEntity {
  id: string;          // UUID (PK)
  created_at: Date;    // Tự động tạo
  updated_at: Date;    // Tự động cập nhật
  deleted_at: Date;    // Soft delete
}
```

> Soft delete được bật mặc định thông qua `@DeleteDateColumn`.
