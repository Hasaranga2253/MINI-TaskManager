using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class CreateTaskRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false;
    }

    public class UpdateTaskRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsCompleted { get; set; }
    }
}
