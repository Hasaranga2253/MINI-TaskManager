using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // Temporary user id for now
        private string GetCurrentUserId()
        {
            return "demo-user-123";
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var userId = GetCurrentUserId();

            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();

            return Ok(tasks);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
            {
                return BadRequest(new { message = "Title is required." });
            }

            task.UserId = GetCurrentUserId();

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(int id, TaskItem updatedTask)
        {
            var userId = GetCurrentUserId();

            var existingTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (existingTask == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            if (string.IsNullOrWhiteSpace(updatedTask.Title))
            {
                return BadRequest(new { message = "Title is required." });
            }

            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.IsCompleted = updatedTask.IsCompleted;

            await _context.SaveChangesAsync();

            return Ok(existingTask);
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId();

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully." });
        }
    }
}