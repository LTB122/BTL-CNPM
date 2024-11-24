# **Kiến trúc hệ thống HCMUT_SSPS**

## **3.1 Layered Architecture**
- **Presentation Layer:** Giao diện web cho sinh viên và SPSO.
- **Business Layer:** Xử lý nghiệp vụ (in ấn, thanh toán, xác thực người dùng).
- **Persistence Layer:** Kết nối với cơ sở dữ liệu.
- **Database Layer:** Quản lý dữ liệu thực tế.

---

## **3.2 Presentation Strategy**
- **Công nghệ:** Pug và Bootstrap cho giao diện người dùng.
- **Thiết kế:** Đáp ứng trên nhiều thiết bị.

---

## **3.3 Data Storage Approach**
- **MongoDB:** Quản lý thông tin người dùng, máy in, đơn in và giao dịch.

---

## **3.4 API Management**
Cung cấp các API cho xác thực, xử lý in, thanh toán, quản lý máy in, và báo cáo.

---

## **3.5 Component Diagram**
- **HCMUT_SSPS:** Quản lý in, thông báo và xử lý file.
- **HCMUT_SSO:** Xác thực đăng nhập.
- **Document Processor:** Kiểm tra file.
- **Database:** Lưu trữ dữ liệu.

### **Luồng hoạt động:**
1. Đăng nhập qua HCMUT_SSO.
2. Tải và kiểm tra tài liệu.
3. Chọn máy in và in tài liệu.
4. Nhận thông báo trạng thái.

## **Lưu ý**
Toàn bộ chi tiết đã được trình bày trong tài liệu PDF đính kèm