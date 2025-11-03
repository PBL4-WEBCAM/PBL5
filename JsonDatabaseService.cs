using System.Text.Json;

namespace PBL5.Services
{
    public class JsonDatabaseService
    {
        private readonly string vocabFile;
        private readonly string notebookFile;

        public JsonDatabaseService()
        {
            // Sử dụng FileSystem.AppDataDirectory cho MAUI để lưu dữ liệu
            string appDataDirectory = FileSystem.AppDataDirectory;
            vocabFile = Path.Combine(appDataDirectory, "vocabulary.json");
            notebookFile = Path.Combine(appDataDirectory, "notebooks.json");

            if (!File.Exists(vocabFile))
                File.WriteAllText(vocabFile, "[]");

            if (!File.Exists(notebookFile))
                File.WriteAllText(notebookFile, "[]");
        }

        // --- Vocabulary ---
        public async Task<List<VocabularyItem>> LoadVocabularyAsync()
        {
            string json = await File.ReadAllTextAsync(vocabFile);
            return JsonSerializer.Deserialize<List<VocabularyItem>>(json) ?? new List<VocabularyItem>();
        }

        public async Task SaveVocabularyAsync(List<VocabularyItem> list)
        {
            string json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(vocabFile, json);
        }

        // --- Notebook ---
        public async Task<List<Notebook>> LoadNotebooksAsync()
        {
            string json = await File.ReadAllTextAsync(notebookFile);
            return JsonSerializer.Deserialize<List<Notebook>>(json) ?? new List<Notebook>();
        }

        public async Task SaveNotebooksAsync(List<Notebook> list)
        {
            string json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(notebookFile, json);
        }
    }

    // ✅ Định nghĩa 2 class model ở đây, có public để component khác truy cập được
    public class VocabularyItem
    {
        public string Word { get; set; } = string.Empty;
        public string Meaning { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; } = DateTime.Now;
        public bool IsLearned { get; set; } = false;
        public string NotebookName { get; set; } = string.Empty;
    }

    public class Notebook
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
