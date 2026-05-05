import { db } from "@workspace/db";
import { menusTable, blogPostsTable, siteSettingsTable, abTestsTable } from "@workspace/db/schema";

export async function seedDatabase() {
  const existingMenus = await db.select().from(menusTable).limit(1);
  if (existingMenus.length > 0) return;

  await db.insert(menusTable).values([
    {
      name: "Menu Sức Sống Xanh",
      slug: "menu-suc-song-xanh",
      description: "Thực đơn eat clean, cân bằng dinh dưỡng, phù hợp cho văn phòng hiện đại.",
      long_description: "Menu Sức Sống Xanh là lựa chọn hàng đầu cho doanh nghiệp quan tâm đến sức khỏe nhân viên. Với triết lý eat clean, chúng tôi sử dụng 100% nguyên liệu tươi, hạn chế dầu mỡ và gia vị nhân tạo. Suất ăn văn phòng cao cấp này được thiết kế bởi chuyên gia dinh dưỡng, đảm bảo cung cấp đủ protein, chất xơ và vitamin cần thiết cho một ngày làm việc năng suất. Phù hợp cho doanh nghiệp từ 10 đến 500+ nhân viên, giao tận nơi đúng giờ mỗi ngày.",
      tag: "Eat Clean",
      target_audience: "Văn phòng, Startup, Công ty tech",
      price_per_person: 95000,
      image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&q=90",
      category: "office",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Cơm gạo lứt hữu cơ", description: "Gạo lứt nấu dẻo, giàu chất xơ" },
        { name: "Ức gà áp chảo sốt chanh leo", description: "Ức gà không da, low-fat, sốt chanh leo tự nhiên" },
        { name: "Salad rau củ mix 5 loại", description: "Rau xanh tươi, dầu ô liu nguyên chất" },
        { name: "Canh bí đỏ hầm", description: "Bí đỏ hầm mềm, ngọt tự nhiên" },
        { name: "Trái cây tráng miệng", description: "Trái cây theo mùa, tươi ngon" },
      ],
      nutrition_calories: 380,
      nutrition_protein: 35,
      nutrition_fat: 8,
      nutrition_carbs: 42,
      min_guests: 10,
      seo_metadata: { meta_title: "Menu Sức Sống Xanh — Eat Clean 95.000đ/suất | BELUGA Catering", meta_description: "Thực đơn eat clean văn phòng, giao tận nơi tại TP.HCM. Đặt hàng ngay từ 10 suất." },
      faqs: [
        { q: "Menu có phù hợp người ăn kiêng không?", a: "Hoàn toàn phù hợp — thiết kế đặc biệt cho người eat clean và ăn kiêng healthy." },
        { q: "Có thể tùy chỉnh không có gluten không?", a: "Có thể điều chỉnh theo yêu cầu — báo trước khi đặt hàng." },
        { q: "Calories mỗi suất là bao nhiêu?", a: "Khoảng 380 Kcal/suất — phù hợp bữa trưa eat clean." },
      ],
    },
    {
      name: "Menu Đậm Đà Vị Việt",
      slug: "menu-dam-da-vi-viet",
      description: "Hương vị truyền thống Việt Nam, nguyên liệu tươi mỗi ngày, phù hợp khẩu vị đại đa số.",
      long_description: "Menu Đậm Đà Vị Việt là sự tôn vinh ẩm thực truyền thống Việt Nam trong môi trường văn phòng hiện đại. Những món ăn quen thuộc như canh chua, thịt kho, cá chiên được biến tấu tinh tế bởi đội đầu bếp BELUGA, giữ nguyên hương vị đậm đà nhưng đảm bảo vệ sinh an toàn thực phẩm. Suất ăn văn phòng dành cho nhân viên muốn có bữa trưa ngon miệng như cơm nhà, giá thực sự tiết kiệm cho doanh nghiệp.",
      tag: "Truyền thống",
      target_audience: "Văn phòng, Nhà máy, Khu công nghiệp",
      price_per_person: 85000,
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90",
      category: "office",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Cơm trắng dẻo", description: "Gạo tám thơm nấu đúng chuẩn" },
        { name: "Thịt kho trứng", description: "Thịt ba chỉ kho tàu, trứng vịt đậm vị" },
        { name: "Canh chua cá lóc", description: "Canh chua truyền thống, cá lóc tươi" },
        { name: "Rau muống xào tỏi", description: "Rau muống xào nhanh, tỏi thơm" },
        { name: "Dưa leo ngâm chua ngọt", description: "Dưa leo giòn, chua ngọt vừa miệng" },
      ],
      nutrition_calories: 420,
      nutrition_protein: 28,
      nutrition_fat: 14,
      nutrition_carbs: 52,
      min_guests: 10,
      seo_metadata: { meta_title: "Menu Đậm Đà Vị Việt — Cơm VP 85.000đ/suất | BELUGA Catering", meta_description: "Cơm văn phòng Việt Nam truyền thống, ngon như cơm nhà. Giao tận nơi tại TP.HCM từ 85.000đ." },
      faqs: [
        { q: "Thực đơn Việt có thay đổi hàng ngày không?", a: "Có, thực đơn thay đổi hàng ngày trong chu kỳ 14 ngày để tránh nhàm chán." },
        { q: "Có thể yêu cầu không cay không?", a: "Hoàn toàn có thể, báo khi đặt hàng để đội bếp điều chỉnh gia vị." },
      ],
    },
    {
      name: "Menu Tiệc Trưa Thành Công",
      slug: "menu-tiec-trua-thanh-cong",
      description: "Thực đơn cao cấp cho tiệc trưa doanh nghiệp, hội nghị, tiếp khách quan trọng.",
      long_description: "Menu Tiệc Trưa Thành Công được thiết kế đặc biệt cho những buổi tiếp khách quan trọng, hội nghị cấp cao và tiệc trưa doanh nghiệp trang trọng. Mỗi món ăn được chuẩn bị tỉ mỉ với nguyên liệu cao cấp nhập khẩu và trong nước, trình bày đẹp mắt theo chuẩn nhà hàng 5 sao. Catering chuyên nghiệp phục vụ từng bàn với đội ngũ phục vụ đồng phục chuyên nghiệp.",
      tag: "Cao cấp",
      target_audience: "Tiệc doanh nghiệp, Hội nghị, Tiếp khách VIP",
      price_per_person: 350000,
      image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=90",
      category: "event",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Khai vị: Salad tôm hùm baby", description: "Tôm hùm baby xào bơ, salad rau mầm" },
        { name: "Súp kem nấm truffle", description: "Súp kem nấm cao cấp, hương truffle" },
        { name: "Cá hồi áp chảo sốt chanh dây", description: "Cá hồi Na Uy tươi, sốt chanh dây Đà Lạt" },
        { name: "Thăn bò Wagyu hạng A3", description: "Bò Wagyu nướng vừa chín, sốt nấm đen" },
        { name: "Tráng miệng: Bánh mousse dâu tây", description: "Bánh mousse Pháp, dâu tây tươi Đà Lạt" },
      ],
      nutrition_calories: 650,
      nutrition_protein: 55,
      nutrition_fat: 28,
      nutrition_carbs: 48,
      min_guests: 20,
      seo_metadata: { meta_title: "Menu Tiệc Trưa Cao Cấp 350.000đ — Hội Nghị VIP | BELUGA Catering", meta_description: "Tiệc trưa doanh nghiệp cao cấp tại TP.HCM. Set menu 5 món, phục vụ chuyên nghiệp." },
      faqs: [
        { q: "Có phục vụ tại địa điểm của khách không?", a: "Có, BELUGA đến tận địa điểm với đội phục vụ chuyên nghiệp và setup hoàn chỉnh." },
        { q: "Thời gian phục vụ bao lâu?", a: "Phục vụ 2-4 giờ tùy quy mô sự kiện." },
      ],
    },
    {
      name: "Menu Hải Sản Nhiệt Đới",
      slug: "menu-hai-san-nhiet-doi",
      description: "Bữa tiệc hải sản tươi sống, đặc sắc ẩm thực biển Việt Nam.",
      long_description: "Menu Hải Sản Nhiệt Đới tôn vinh vẻ đẹp phong phú của hải sản Việt Nam. Từ tôm hùm đến ghẹ biển, cá mú đến sò điệp — tất cả đều được lấy tươi mỗi ngày từ vựa hải sản lớn nhất TP.HCM. Đây là lựa chọn lý tưởng cho tiệc gala doanh nghiệp, tiệc tất niên muốn tạo ấn tượng với khách mời bằng hải sản cao cấp.",
      tag: "Hải sản",
      target_audience: "Gala dinner, Tiệc tất niên, Sự kiện đặc biệt",
      price_per_person: 280000,
      image_url: "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=1400&q=90",
      category: "event",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Tôm hùm nướng bơ tỏi", description: "Tôm hùm tươi 500g/con, bơ tỏi thơm" },
        { name: "Ghẹ rang me", description: "Ghẹ biển tươi xào me chua ngọt đặc trưng" },
        { name: "Cá mú hấp sốt đậu đen", description: "Cá mú tươi hấp kiểu Quảng Đông" },
        { name: "Sò điệp nướng mỡ hành", description: "Sò điệp Phú Quốc nướng, mỡ hành thơm" },
        { name: "Tráng miệng: Thạch trái cây biển", description: "Thạch dừa, trái cây nhiệt đới" },
      ],
      nutrition_calories: 480,
      nutrition_protein: 52,
      nutrition_fat: 16,
      nutrition_carbs: 30,
      min_guests: 30,
      seo_metadata: { meta_title: "Menu Hải Sản Nhiệt Đới 280.000đ — Tiệc Gala | BELUGA Catering", meta_description: "Buffet hải sản cao cấp cho gala dinner và tiệc sự kiện tại TP.HCM." },
      faqs: [
        { q: "Hải sản có tươi sống không?", a: "100% hải sản tươi sống, lấy buổi sáng ngày phục vụ từ vựa hải sản lớn nhất TP.HCM." },
        { q: "Có menu chay thay thế không?", a: "Có thể điều chỉnh cho khách không ăn hải sản — liên hệ để tư vấn." },
      ],
    },
    {
      name: "Menu Teabreak Quý Tộc",
      slug: "menu-teabreak-quy-toc",
      description: "Teabreak cao cấp cho hội nghị, hội thảo, sự kiện doanh nghiệp.",
      long_description: "Menu Teabreak Quý Tộc là giải pháp hoàn hảo cho những buổi hội nghị, hội thảo và sự kiện doanh nghiệp muốn để lại ấn tượng với khách mời. Với bánh ngọt handmade, trà thượng hảo hạng và cà phê specialty, teabreak của bạn sẽ trở thành điểm nhấn đáng nhớ.",
      tag: "Teabreak",
      target_audience: "Hội nghị, Hội thảo, Ra mắt sản phẩm",
      price_per_person: 120000,
      image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=1400&q=90",
      category: "teabreak",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Bánh macaron Pháp đa màu", description: "Macaron handmade 6 vị: chanh, dâu, chocolate, matcha, vanilla, hoa hồng" },
        { name: "Mini sandwich bánh mì nướng", description: "Sandwich nhân salmon cream cheese, jambon thượng hảo hạng" },
        { name: "Trà Oolong Đài Loan thượng hạng", description: "Trà Oolong cao cấp, pha theo cách truyền thống" },
        { name: "Cà phê specialty Single Origin", description: "Cà phê Arabica Đà Lạt rang xay ngay tại buổi" },
        { name: "Bánh croissant bơ Pháp", description: "Croissant nướng tươi, bơ Lurpak nhập khẩu" },
      ],
      nutrition_calories: 280,
      nutrition_protein: 8,
      nutrition_fat: 12,
      nutrition_carbs: 38,
      min_guests: 20,
      seo_metadata: { meta_title: "Teabreak Cao Cấp 120.000đ — Hội Nghị & Sự Kiện | BELUGA Catering", meta_description: "Teabreak chuyên nghiệp cho hội nghị tại TP.HCM. Bánh ngọt cao cấp, trà specialty." },
      faqs: [
        { q: "Teabreak cần setup bao lâu?", a: "BELUGA setup trong vòng 30-45 phút trước giờ break." },
        { q: "Có thể đặt số lượng ít không?", a: "Tối thiểu 20 phần teabreak — phù hợp cho hội nghị nhỏ." },
      ],
    },
    {
      name: "Menu Buffet Á-Âu",
      slug: "menu-buffet-a-au",
      description: "Buffet đa dạng ẩm thực Á và Âu, phù hợp mọi khẩu vị trong sự kiện lớn.",
      long_description: "Menu Buffet Á-Âu là sự kết hợp tinh tế giữa ẩm thực châu Á và châu Âu, tạo nên một bàn tiệc buffet phong phú và hấp dẫn. Với hơn 25 món được bày trí đẹp mắt, từ sushi Nhật Bản đến pasta Ý, từ dimsum Trung Hoa đến BBQ Mỹ — mỗi khách mời đều tìm được món ăn ưa thích.",
      tag: "Buffet",
      target_audience: "Sự kiện lớn, Tiệc hội nghị, Khai trương",
      price_per_person: 200000,
      image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&q=90",
      category: "buffet",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Sushi & Sashimi đa loại", description: "Sushi cuộn, nigiri, sashimi cá hồi và cá ngừ" },
        { name: "Dimsum 6 loại", description: "Ha cao, siu mai, bánh bao, chả giò hấp" },
        { name: "Pasta Ý sốt bolognese & carbonara", description: "Pasta tươi, sốt tự nấu ngày phục vụ" },
        { name: "BBQ rib Mỹ nướng chậm", description: "Sườn heo nướng 8 tiếng, sốt BBQ đặc biệt" },
        { name: "Dessert station đa dạng", description: "Bánh ngọt, pudding, trái cây, kem Ý" },
      ],
      nutrition_calories: 550,
      nutrition_protein: 32,
      nutrition_fat: 22,
      nutrition_carbs: 65,
      min_guests: 50,
      seo_metadata: { meta_title: "Buffet Á-Âu 200.000đ — Tiệc Sự Kiện Lớn | BELUGA Catering", meta_description: "Buffet cao cấp kết hợp Á-Âu cho tiệc sự kiện tại TP.HCM. 25+ món, phục vụ chuyên nghiệp." },
      faqs: [
        { q: "Buffet phục vụ trong bao lâu?", a: "Thông thường 2-3 giờ/buổi. Có thể điều chỉnh theo lịch trình sự kiện." },
        { q: "Có thể thêm trạm nấu trực tiếp không?", a: "Có, thêm trạm nấu live như BBQ, teppanyaki với phụ phí theo thỏa thuận." },
      ],
    },
    {
      name: "Menu Khai Trương Hồng Phát",
      slug: "menu-khai-truong-hong-phat",
      description: "Thực đơn đặc biệt mang ý nghĩa may mắn cho ngày khai trương và lễ kỷ niệm.",
      long_description: "Menu Khai Trương Hồng Phát được thiết kế đặc biệt với ý nghĩa mang lại may mắn, thịnh vượng cho ngày khai trương, lễ kỷ niệm thành lập công ty. Mỗi món ăn được chọn lựa theo quan niệm phong thủy — tôm hồng phát tài, cá chép vượt vũ môn, bánh in hình tài lộc — tạo nên bữa tiệc ý nghĩa và ấn tượng với khách mời.",
      tag: "Khai trương",
      target_audience: "Khai trương, Lễ kỷ niệm, Tất niên",
      price_per_person: 180000,
      image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90",
      category: "event",
      is_active: true,
      is_featured: false,
      dishes: [
        { name: "Tôm hùm hấp gừng (Phát tài)", description: "Tôm hùm đỏ tươi, hấp gừng sả" },
        { name: "Cá chép chiên xù sốt chua ngọt (Vượt vũ môn)", description: "Cá chép giòn, sốt chua ngọt truyền thống" },
        { name: "Heo quay Bến Tre da giòn", description: "Heo quay truyền thống, da giòn tan" },
        { name: "Xôi gấc đỏ may mắn", description: "Xôi gấc đỏ tươi, hạt sen, hạnh nhân" },
        { name: "Bánh in tài lộc", description: "Bánh in truyền thống hình tài lộc" },
      ],
      nutrition_calories: 520,
      nutrition_protein: 38,
      nutrition_fat: 25,
      nutrition_carbs: 44,
      min_guests: 30,
      seo_metadata: { meta_title: "Menu Khai Trương Hồng Phát 180.000đ — May Mắn Tài Lộc | BELUGA", meta_description: "Thực đơn khai trương may mắn, tiệc lễ kỷ niệm tại TP.HCM. Đặt ngay cho ngày trọng đại." },
      faqs: [
        { q: "Menu này có thể trang trí theo chủ đề không?", a: "Có, BELUGA trang trí bàn tiệc theo màu đỏ-vàng phong thủy theo yêu cầu." },
      ],
    },
    {
      name: "Menu Bento Nhật Bản",
      slug: "menu-bento-nhat-ban",
      description: "Hộp bento Nhật Bản cân đối dinh dưỡng, trình bày đẹp mắt cho văn phòng cao cấp.",
      long_description: "Menu Bento Nhật Bản mang phong cách ẩm thực tinh tế Nhật Bản vào bữa trưa văn phòng của bạn. Mỗi hộp bento được chuẩn bị tỉ mỉ với cơm Nhật dẻo thơm, cá hồi, edamame và rau củ theo mùa. Thiết kế hộp bento đẹp mắt phù hợp với văn phòng cấp cao, tạo ấn tượng tốt khi phục vụ khách hàng và đối tác.",
      tag: "Nhật Bản",
      target_audience: "Văn phòng cao cấp, Tiếp khách, Hội họp nội bộ",
      price_per_person: 150000,
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d69a?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1400&q=90",
      category: "office",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Cơm Nhật sushi rice", description: "Gạo Nhật nấu chuẩn vị, dẻo thơm" },
        { name: "Cá hồi teriyaki", description: "Cá hồi Na Uy sốt teriyaki đậm vị" },
        { name: "Gyoza chiên giòn", description: "Gyoza nhân thịt heo và bắp cải, chiên vàng đều" },
        { name: "Edamame luộc muối", description: "Đậu edamame luộc chín tới, muối biển" },
        { name: "Miso soup", description: "Canh miso truyền thống với tofu và rong biển" },
      ],
      nutrition_calories: 450,
      nutrition_protein: 35,
      nutrition_fat: 15,
      nutrition_carbs: 50,
      min_guests: 10,
      seo_metadata: { meta_title: "Menu Bento Nhật Bản 150.000đ — Cơm VP Cao Cấp | BELUGA Catering", meta_description: "Hộp bento Nhật Bản cao cấp cho văn phòng tại TP.HCM. Trình bày đẹp, dinh dưỡng đầy đủ." },
      faqs: [
        { q: "Hộp bento có thể dùng logo công ty không?", a: "Có thể in logo công ty lên nắp hộp với đơn từ 50 phần trở lên." },
      ],
    },
    {
      name: "Menu Tiệc Đứng Canapé",
      slug: "menu-tiec-dung-canape",
      description: "Tiệc đứng với các món canapé và finger food sang trọng cho sự kiện networking.",
      long_description: "Menu Tiệc Đứng Canapé là lựa chọn hoàn hảo cho các sự kiện networking, cocktail party, và gặp gỡ đối tác. Các món finger food được chuẩn bị tỉ mỉ, vừa miệng, dễ cầm khi đứng giao lưu. Sự kết hợp giữa ẩm thực Á-Âu tạo nên trải nghiệm thú vị và đa dạng cho khách mời.",
      tag: "Tiệc đứng",
      target_audience: "Networking, Cocktail party, Ra mắt sản phẩm",
      price_per_person: 220000,
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=1400&q=90",
      category: "event",
      is_active: true,
      is_featured: false,
      dishes: [
        { name: "Bruschetta cà chua & basil", description: "Bánh mì nướng, cà chua bi, húng quế tươi" },
        { name: "Canapé smoked salmon cream cheese", description: "Cá hồi hun khói, cream cheese Philadelphia" },
        { name: "Mini spring roll chiên giòn", description: "Chả giò mini chiên giòn, chấm sốt tương hoisin" },
        { name: "Bánh bao mini nhân xá xíu", description: "Bánh bao hấp mini, nhân xá xíu đặc biệt" },
        { name: "Macaron và petit four", description: "Bánh ngọt Pháp miniature, đa hương vị" },
      ],
      nutrition_calories: 320,
      nutrition_protein: 18,
      nutrition_fat: 14,
      nutrition_carbs: 36,
      min_guests: 30,
      seo_metadata: { meta_title: "Menu Tiệc Đứng Canapé 220.000đ — Cocktail Party | BELUGA Catering", meta_description: "Tiệc đứng canapé sang trọng cho cocktail party và networking tại TP.HCM." },
      faqs: [
        { q: "Phục vụ bao nhiêu vòng canapé?", a: "Phục vụ 3-4 vòng trong 2 giờ, liên tục bổ sung để khách không thiếu đồ ăn." },
      ],
    },
    {
      name: "Menu Chay An Nhiên",
      slug: "menu-chay-an-nhien",
      description: "Thực đơn thuần chay, dinh dưỡng đầy đủ, phù hợp mọi ngày và dịp đặc biệt.",
      long_description: "Menu Chay An Nhiên được thiết kế dành cho những ai theo đuổi lối sống thuần chay hoặc tổ chức sự kiện cần phục vụ khách ăn chay. Với nguyên liệu 100% thực vật, không sử dụng thịt cá, đảm bảo đầy đủ protein từ đậu hũ, đậu xanh và nấm. Thực đơn phong phú, hương vị đậm đà không thua kém thực đơn mặn.",
      tag: "Chay",
      target_audience: "Văn phòng chay, Sự kiện Phật giáo, Ngày rằm",
      price_per_person: 90000,
      image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
      banner_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=90",
      category: "vegan",
      is_active: true,
      is_featured: true,
      dishes: [
        { name: "Cơm gạo lứt hạt sen", description: "Gạo lứt nấu với hạt sen Đồng Tháp" },
        { name: "Đậu hũ kho xả ớt", description: "Đậu hũ non kho sả ớt đậm đà" },
        { name: "Nấm đông cô xào rau củ", description: "Nấm đông cô Hàn Quốc xào 5 loại rau củ" },
        { name: "Canh rau ngót đậu xanh", description: "Canh rau ngót nấu đậu xanh, ngọt tự nhiên" },
        { name: "Tráng miệng: Chè đậu xanh lá dứa", description: "Chè đậu xanh nước dừa, lá dứa thơm" },
      ],
      nutrition_calories: 360,
      nutrition_protein: 22,
      nutrition_fat: 7,
      nutrition_carbs: 58,
      min_guests: 10,
      seo_metadata: { meta_title: "Menu Chay An Nhiên 90.000đ — Cơm Chay Văn Phòng | BELUGA Catering", meta_description: "Suất ăn chay thuần chay, dinh dưỡng đầy đủ cho văn phòng tại TP.HCM từ 90.000đ." },
      faqs: [
        { q: "Menu chay có 100% thuần chay không?", a: "Có, 100% thuần chay — không sử dụng thịt, cá, trứng và sữa. Phù hợp cho người theo đạo." },
        { q: "Có thể đặt ngày rằm và mùng 1 không?", a: "Có, BELUGA nhận đặt và ưu tiên slot cho các ngày rằm, mùng 1 và dịp lễ Phật giáo." },
      ],
    },
  ]);

  await db.insert(blogPostsTable).values([
    {
      title: "Thực Đơn Cơm Văn Phòng Đủ Chất — Bí Quyết Giữ Nhân Viên Khỏe Mạnh",
      slug: "thuc-don-com-van-phong-du-chat",
      content: `<h2>Tại Sao Bữa Trưa Văn Phòng Quan Trọng?</h2>
<p>Nghiên cứu từ Đại học Harvard cho thấy nhân viên ăn trưa đủ chất có năng suất làm việc cao hơn 25% và tỷ lệ nghỉ bệnh thấp hơn 30%. Đầu tư vào bữa trưa nhân viên chính là đầu tư vào hiệu suất công ty.</p>
<h2>Nguyên Tắc Xây Dựng Thực Đơn Cơm Văn Phòng Cân Bằng</h2>
<p>Một suất ăn văn phòng lý tưởng cần đảm bảo: <strong>40% tinh bột</strong> (năng lượng), <strong>35% protein</strong> (duy trì cơ bắp), <strong>25% rau xanh và chất xơ</strong> (tiêu hóa). Đây là tỷ lệ được Viện Dinh Dưỡng Quốc Gia Việt Nam khuyến nghị.</p>
<h2>5 Nguyên Tắc BELUGA Áp Dụng Cho Thực Đơn Văn Phòng</h2>
<p>1. <strong>Nguyên liệu tươi mỗi ngày</strong> — không dùng thực phẩm đông lạnh qua đêm<br>2. <strong>Thay đổi thực đơn 14 ngày</strong> — tránh nhàm chán và đảm bảo đa dạng dinh dưỡng<br>3. <strong>Hạn chế muối và đường</strong> — phù hợp xu hướng ăn clean hiện đại<br>4. <strong>Đủ protein</strong> — mỗi suất tối thiểu 25g protein từ thịt/cá/đậu<br>5. <strong>Trái cây tráng miệng</strong> — vitamin tự nhiên, ngọt tự nhiên</p>
<h2>Gợi Ý Thực Đơn Tuần Cho Văn Phòng 50 Người</h2>
<p>BELUGA thiết kế thực đơn xoay vòng 14 ngày với sự tư vấn của chuyên gia dinh dưỡng. Mỗi ngày có ít nhất 1 món rau xanh, 1 món protein động vật và 1 món protein thực vật. <a href="/com-van-phong">Xem dịch vụ cơm văn phòng →</a></p>`,
      excerpt: "Bí quyết xây dựng thực đơn cơm văn phòng đủ chất, giúp nhân viên khỏe mạnh và năng suất cao.",
      category: "thuc-don-moi-ngay",
      featured_image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200&q=85",
      author: "BELUGA Nutrition Team",
      is_published: true,
      published_at: new Date("2025-01-15"),
      reading_time: 5,
      tags: ["cơm văn phòng", "dinh dưỡng", "thực đơn", "eat clean"],
      meta_title: "Thực Đơn Cơm Văn Phòng Đủ Chất — Bí Quyết Sức Khỏe Nhân Viên",
      meta_description: "Cách xây dựng thực đơn cơm văn phòng cân bằng dinh dưỡng. Tips từ BELUGA Catering để nhân viên khỏe mạnh và năng suất hơn.",
    },
    {
      title: "5 Sai Lầm Khi Đặt Suất Ăn Công Nghiệp Khiến Doanh Nghiệp Tốn Tiền",
      slug: "sai-lam-dat-suat-an-cong-nghiep",
      content: `<h2>Bài Toán Suất Ăn Công Nghiệp — Tưởng Đơn Giản Nhưng Không Phải Vậy</h2>
<p>Nhiều doanh nghiệp, nhà máy khi lần đầu đặt suất ăn công nghiệp thường mắc những sai lầm đắt giá. BELUGA tổng hợp 5 sai lầm phổ biến nhất để bạn tránh.</p>
<h2>Sai Lầm 1: Chọn Nhà Cung Cấp Giá Rẻ Nhất</h2>
<p>Giá rẻ thường đi kèm với nguyên liệu kém chất lượng, vệ sinh không đảm bảo. Một vụ ngộ độc thực phẩm có thể khiến doanh nghiệp tốn hàng trăm triệu đồng bồi thường và ảnh hưởng nghiêm trọng đến uy tín. <a href="/suat-an-cong-nghiep">Xem tiêu chuẩn VSATTP của BELUGA →</a></p>
<h2>Sai Lầm 2: Không Kiểm Tra Giấy Phép VSATTP</h2>
<p>Theo Nghị định 155/2018/NĐ-CP, nhà cung cấp suất ăn cho 200+ người phải có Giấy chứng nhận VSATTP. Kiểm tra kỹ trước khi ký hợp đồng.</p>
<h2>Sai Lầm 3: Thực Đơn Cố Định Không Thay Đổi</h2>
<p>Ăn một thực đơn cố định liên tục khiến công nhân chán nản, ảnh hưởng tinh thần làm việc. Chọn nhà cung cấp có thực đơn xoay vòng ít nhất 2 tuần.</p>
<h2>Sai Lầm 4: Không Có Hợp Đồng Rõ Ràng</h2>
<p>Hợp đồng cần quy định rõ: giờ giao hàng, số suất tối thiểu/tối đa, tiêu chuẩn chất lượng, điều khoản phạt khi vi phạm. Đừng chỉ thỏa thuận miệng.</p>
<h2>Sai Lầm 5: Không Thử Nghiệm Trước Khi Ký Hợp Đồng Dài Hạn</h2>
<p>Luôn yêu cầu dùng thử 1-2 tuần trước khi ký hợp đồng tháng/quý. BELUGA luôn cung cấp tuần thử nghiệm miễn phụ phí cho khách hàng mới.</p>`,
      excerpt: "Tránh 5 sai lầm phổ biến khi đặt suất ăn công nghiệp để tiết kiệm chi phí và đảm bảo an toàn thực phẩm.",
      category: "kinh-nghiem-suat-an",
      featured_image: "https://images.unsplash.com/photo-1488992783499-418eb1f62d08?w=1200&q=85",
      author: "BELUGA Team",
      is_published: true,
      published_at: new Date("2025-02-01"),
      reading_time: 6,
      tags: ["suất ăn công nghiệp", "kinh nghiệm", "VSATTP", "khu công nghiệp"],
      meta_title: "5 Sai Lầm Khi Đặt Suất Ăn Công Nghiệp — Tránh Để Không Lãng Phí",
      meta_description: "Hướng dẫn tránh 5 sai lầm phổ biến khi đặt suất ăn công nghiệp cho nhà máy và khu công nghiệp.",
    },
    {
      title: "Checklist Hoàn Chỉnh Để Tổ Chức Tiệc Công Ty Thành Công",
      slug: "checklist-to-chuc-tiec-cong-ty",
      content: `<h2>Bí Quyết Tổ Chức Tiệc Công Ty Không Bao Giờ Hỏng</h2>
<p>Sau hơn 300 tiệc doanh nghiệp, BELUGA đúc kết checklist hoàn chỉnh giúp bạn tổ chức tiệc công ty hoàn hảo mà không bỏ sót bất kỳ chi tiết nào.</p>
<h2>6 Tuần Trước Tiệc</h2>
<p>✅ Xác định ngân sách và số lượng khách<br>✅ Chọn địa điểm tổ chức<br>✅ Liên hệ đơn vị catering như BELUGA để tư vấn thực đơn<br>✅ Lên concept và chủ đề tiệc<br>✅ Gửi lịch cho nhân sự nội bộ</p>
<h2>2 Tuần Trước Tiệc</h2>
<p>✅ Xác nhận số lượng khách chính thức<br>✅ Ký hợp đồng với đơn vị catering và địa điểm<br>✅ Đặt cọc theo quy định<br>✅ Xác nhận thực đơn và dị ứng thực phẩm của khách</p>
<h2>Ngày Trước Tiệc</h2>
<p>✅ Liên hệ reconfirm với catering<br>✅ Chuẩn bị name card, backdrop, décor<br>✅ Test âm thanh, ánh sáng nếu có</p>
<h2>Ngày Tiệc</h2>
<p>✅ Đội catering setup trước 2-3 tiếng<br>✅ Kiểm tra setup thực đơn và phục vụ<br>✅ Chạy đúng timeline sự kiện<br>✅ Phản hồi cho catering về chất lượng</p>
<p><strong>Tip:</strong> Với tiệc tất niên cuối năm, nên đặt trước tối thiểu 4-6 tuần vì slot catering thường đầy rất sớm. <a href="/dat-tiec-cong-ty">Xem dịch vụ đặt tiệc công ty →</a></p>`,
      excerpt: "Checklist đầy đủ từ A-Z để tổ chức tiệc công ty hoàn hảo, không bỏ sót bất kỳ chi tiết quan trọng nào.",
      category: "meo-to-chuc-tiec",
      featured_image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85",
      author: "BELUGA Event Team",
      is_published: true,
      published_at: new Date("2025-02-15"),
      reading_time: 7,
      tags: ["tiệc công ty", "tổ chức sự kiện", "checklist", "tất niên"],
      meta_title: "Checklist Tổ Chức Tiệc Công Ty — Từ A Đến Z Không Thiếu Sót",
      meta_description: "Hướng dẫn checklist hoàn chỉnh để tổ chức tiệc công ty thành công. Tips từ đội ngũ BELUGA với 300+ sự kiện.",
    },
    {
      title: "Dinh Dưỡng Bữa Trưa Văn Phòng — Ăn Đúng Để Làm Việc Hiệu Quả Hơn",
      slug: "dinh-duong-bua-trua-van-phong",
      content: `<h2>Bữa Trưa Ảnh Hưởng Đến Năng Suất Làm Việc Như Thế Nào?</h2>
<p>Sau khi ăn trưa, não cần khoảng 20% tổng năng lượng cơ thể để hoạt động tối ưu. Bữa trưa thiếu chất sẽ khiến bạn buồn ngủ, mất tập trung vào buổi chiều.</p>
<h2>Bảng Dinh Dưỡng Chuẩn Cho Bữa Trưa Văn Phòng</h2>
<table>
<tr><th>Thành phần</th><th>Lượng khuyến nghị</th><th>Nguồn thực phẩm</th></tr>
<tr><td>Protein</td><td>25-35g</td><td>Thịt, cá, đậu hũ</td></tr>
<tr><td>Tinh bột</td><td>50-70g</td><td>Cơm, bún, bánh mì</td></tr>
<tr><td>Chất xơ</td><td>8-10g</td><td>Rau xanh, trái cây</td></tr>
<tr><td>Chất béo tốt</td><td>10-15g</td><td>Dầu ô liu, cá béo</td></tr>
<tr><td>Calories tổng</td><td>500-700 Kcal</td><td>30% nhu cầu ngày</td></tr>
</table>
<h2>3 Loại Bữa Trưa Tốt Nhất Cho Nhân Viên Văn Phòng</h2>
<p><strong>1. Eat Clean:</strong> Cơm gạo lứt + ức gà + rau xanh (380-420 Kcal, lý tưởng cho người ăn kiêng)<br><strong>2. Truyền thống Việt:</strong> Cơm trắng + thịt kho + canh chua (450-500 Kcal, no lâu, phù hợp đa số)<br><strong>3. Bento Nhật:</strong> Sushi rice + cá hồi + salad (400-450 Kcal, nhẹ nhàng, dễ tiêu hóa)</p>
<p>BELUGA cung cấp đầy đủ 3 phong cách thực đơn trên cho cơm văn phòng. <a href="/com-van-phong">Xem thêm →</a></p>`,
      excerpt: "Khám phá bảng dinh dưỡng chuẩn cho bữa trưa văn phòng và cách chọn thực đơn tối ưu cho hiệu suất làm việc.",
      category: "dinh-duong-suc-khoe",
      featured_image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200&q=85",
      author: "BS. Nguyễn Thị Mai — Cộng tác viên BELUGA",
      is_published: true,
      published_at: new Date("2025-03-01"),
      reading_time: 6,
      tags: ["dinh dưỡng", "bữa trưa", "sức khỏe", "văn phòng"],
      meta_title: "Dinh Dưỡng Bữa Trưa Văn Phòng — Ăn Đúng Chuẩn Chuyên Gia",
      meta_description: "Bảng dinh dưỡng chuẩn và gợi ý thực đơn bữa trưa văn phòng tối ưu cho năng suất làm việc.",
    },
    {
      title: "Tự Nấu Vs Đặt Suất Ăn Công Nghiệp — So Sánh Chi Phí Thực Tế",
      slug: "tu-nau-vs-dat-suat-an-cong-nghiep",
      content: `<h2>Bài Toán Kinh Tế: Tự Nấu Hay Đặt Suất Ăn?</h2>
<p>Nhiều nhà máy băn khoăn nên tự xây dựng căn-tin hay đặt suất ăn từ nhà cung cấp bên ngoài. BELUGA phân tích thực tế để bạn có quyết định đúng đắn.</p>
<h2>Chi Phí Tự Nấu (Nhà Máy 300 Công Nhân)</h2>
<table>
<tr><th>Hạng mục</th><th>Chi phí/tháng</th></tr>
<tr><td>Thiết bị bếp ban đầu (khấu hao)</td><td>15.000.000đ</td></tr>
<tr><td>Lương đầu bếp + phụ bếp (4 người)</td><td>40.000.000đ</td></tr>
<tr><td>Nguyên liệu thực phẩm</td><td>180.000.000đ</td></tr>
<tr><td>Điện, nước, gas</td><td>15.000.000đ</td></tr>
<tr><td>Bao bì, vật tư</td><td>8.000.000đ</td></tr>
<tr><td><strong>Tổng</strong></td><td><strong>258.000.000đ</strong></td></tr>
<tr><td>Chi phí/suất (25 ngày)</td><td><strong>172.000đ/suất</strong></td></tr>
</table>
<h2>Chi Phí Đặt Suất Ăn BELUGA (300 Công Nhân)</h2>
<p>Gói tiêu chuẩn: 100.000đ/suất × 300 × 25 ngày = <strong>75.000.000đ/tháng</strong></p>
<p><strong>Tiết kiệm được: 183.000.000đ/tháng (71%)</strong></p>
<h2>Những Lợi Ích Phi Tài Chính Khi Đặt Ngoài</h2>
<p>✅ Không rủi ro ngộ độc thực phẩm (trách nhiệm thuộc nhà cung cấp)<br>✅ Không lo tuyển dụng, quản lý nhân sự bếp<br>✅ Thực đơn đa dạng hơn<br>✅ Tập trung vào core business<br>✅ Không cần đầu tư thiết bị bếp</p>
<p><a href="/suat-an-cong-nghiep">Liên hệ BELUGA để nhận báo giá suất ăn công nghiệp →</a></p>`,
      excerpt: "So sánh chi phí thực tế giữa tự nấu và đặt suất ăn công nghiệp — giúp nhà máy đưa ra quyết định kinh tế đúng đắn.",
      category: "kinh-nghiem-suat-an",
      featured_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85",
      author: "BELUGA Business Team",
      is_published: true,
      published_at: new Date("2025-03-15"),
      reading_time: 7,
      tags: ["suất ăn công nghiệp", "chi phí", "so sánh", "nhà máy"],
      meta_title: "Tự Nấu Vs Đặt Suất Ăn Công Nghiệp — So Sánh Chi Phí Thực Tế 2025",
      meta_description: "Phân tích chi phí thực tế: tự xây dựng căn-tin hay đặt suất ăn công nghiệp từ BELUGA Catering.",
    },
  ]);

  await db.insert(siteSettingsTable).values([
    { key: "branding", value: { site_name: "BELUGA Catering", logo_url: "", favicon_url: "" } },
    { key: "company_info", value: { name: "BELUGA Catering", address: "TP. Hồ Chí Minh", phone: "0909 123 456", email: "hello@belugacatering.vn" } },
    { key: "social_links", value: { facebook: "https://facebook.com/belugacatering", zalo: "0909123456", instagram: "" } },
    { key: "seo_defaults", value: { meta_title: "BELUGA Catering — Suất Ăn Cao Cấp & Tiệc Trọn Gói TPHCM", meta_description: "BELUGA Catering cung cấp suất ăn văn phòng, tiệc sự kiện, buffet cao cấp tại TP.HCM." } },
    { key: "nav_links", value: [{ label: "Dịch vụ", href: "/#services" }, { label: "Thực đơn", href: "/menus" }, { label: "Blog", href: "/blog" }, { label: "Về chúng tôi", href: "/about" }, { label: "Liên hệ", href: "/contact" }] },
    { key: "cta_button", value: { text: "Đặt tiệc ngay", href: "/contact" } },
    { key: "footer_content", value: { copyright: "© 2025 BELUGA Catering. All rights reserved.", links: [{ label: "Dịch vụ", href: "/#services" }, { label: "Thực đơn", href: "/menus" }, { label: "Liên hệ", href: "/contact" }] } },
    { key: "ab_hero_cta", value: { active_variant: "A", variant_A: "Đặt tiệc ngay", variant_B: "Nhận báo giá miễn phí" } },
    { key: "weekly_insight", value: { insights: [], generated_at: null } },
  ]);

  await db.insert(abTestsTable).values([
    { test_name: "hero_cta", variant: "A", impressions: 0, clicks: 0 },
    { test_name: "hero_cta", variant: "B", impressions: 0, clicks: 0 },
  ]);
}
