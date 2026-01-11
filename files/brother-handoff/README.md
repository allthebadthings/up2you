# UP2YOU Jewelry - Website Data Package

## Files Included

### 1. UPDATED_MASTER_WITH_PRICING.csv
**The master inventory database** - Contains all 498 products with:
- SKU numbers (e.g., 26-NECK-001)
- Product names and descriptions
- Categories (Necklace, Ring, Bracelet, Earrings, Set)
- Photo filenames (original and new SKU-based names)
- **Pricing information** (485 items have pricing)
  - Est. Retail Price (price ranges)
  - Pricing Strategy / Notes
- Status (all Active)

**Total Items:** 498
**With Pricing:** 485 (97%)
**Need Pricing:** 13

### 2. JEWELRY_CATALOG_WITH_PRICING.html
**Visual reference catalog** - Open in browser to see:
- All products with photos
- Pricing information displayed
- Filter by category, pricing status, or SKU
- Easy browsing for inventory management

---

## Product Photos

**Location:** `C:/Users/kimbe/Desktop/UP2YOU_ALL_PHOTOS_CLEAN/`

**Photo Naming:**
- Current names: `jewelry_photo_001.jpg`, `jewelry_photo_004.jpg`, etc.
- Corresponding SKUs are in the CSV (Old_Photo_Name to SKU mapping)

---

## For Website Integration

### Database Structure
The CSV contains these columns:
```
SKU, Old_Photo_Name, New_Photo_Name, Category, Name, Description, 
Metal, Size, Price, MSRP, Cost, Notes, Status, 
Pricing_Visual_Description, Est_Retail_Price, Pricing_Strategy_Notes
```

### Product Categories
- **Necklaces:** 250 items (26-NECK-001 to 26-NECK-250)
- **Rings:** 83 items (26-RING-001 to 26-RING-083)
- **Bracelets:** 82 items (26-BRAC-001 to 26-BRAC-082)
- **Earrings:** 28 items (26-EAR-001 to 26-EAR-028)
- **Sets:** 55 items (26-SET-001 to 26-SET-055)

### Pricing Format
- **Est_Retail_Price:** Price ranges like "$12.00 - $18.00"
- **Pricing_Strategy_Notes:** Marketing notes like "Basic minimalist stacker"

---

## Notes

- All product descriptions are customer-ready
- Photos need to be uploaded to website hosting
- SKU system is year-based: 26 = 2026
- 13 items still need pricing (Est_Retail_Price is empty)

---

**Last Updated:** January 9, 2026
**Ready for Website Deployment:** Yes
