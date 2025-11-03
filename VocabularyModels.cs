//namespace PBL5.Models
//{
//    // Model cho Sổ tay
//    public class Notebook
//    {
//        public int Id { get; set; }
//        public string Name { get; set; } = "";
//        public string? Description { get; set; }
//        public DateTime CreatedDate { get; set; } = DateTime.Now;
//        public DateTime ModifiedDate { get; set; } = DateTime.Now;
//    }

//    // Model cho Danh mục
//    public class Category
//    {
//        public int Id { get; set; }
//        public string Name { get; set; } = "";
//        public string? Color { get; set; }
//        public int SortOrder { get; set; } = 0;
//    }

//    // Model cho Từ vựng
//    public class VocabularyItem
//    {
//        public int Id { get; set; }
//        public string Word { get; set; } = "";
//        public string Meaning { get; set; } = "";
//        public string? Note { get; set; }
//        public string? Pronunciation { get; set; }
//        public string? Example { get; set; }
//        public string? ImageUrl { get; set; }

//        public int NotebookId { get; set; }
//        public int CategoryId { get; set; }

//        public DateTime AddedDate { get; set; } = DateTime.Now;
//        public DateTime LastReviewDate { get; set; } = DateTime.Now;
//        public bool IsLearned { get; set; } = false;
//        public int ReviewCount { get; set; } = 0;
//    }

//    // Model cho lịch sử từ camera AI
//    public class DetectedObject
//    {
//        public int Id { get; set; }
//        public string Label { get; set; } = "";
//        public double Confidence { get; set; }
//        public string Vocabulary { get; set; } = "";
//        public string? ThumbnailBase64 { get; set; }
//        public DateTime DetectedTime { get; set; } = DateTime.Now;
//        public bool IsSaved { get; set; } = false;
//        public int? VocabularyItemId { get; set; }
//    }

//    // Model cho cài đặt người dùng
//    public class UserSetting
//    {
//        public string Key { get; set; } = "";
//        public string Value { get; set; } = "";
//    }
//}