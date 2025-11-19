package com.todo.controller;

import com.todo.model.Todo;
import com.todo.model.User;
import com.todo.repository.TodoRepository;
import com.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    
    @Autowired
    private TodoRepository todoRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Todo> todos = todoRepository.findByUserId(user.getId());
        return ResponseEntity.ok(todos);
    }
    
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Map<String, String> request, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String title = request.get("title");
        String status = request.getOrDefault("status", "Pending");
        
        Todo todo = new Todo(title, status, user);
        Todo savedTodo = todoRepository.save(todo);
        
        return ResponseEntity.ok(savedTodo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Map<String, String> request, 
                                           Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        
        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        if (request.containsKey("title")) {
            todo.setTitle(request.get("title"));
        }
        if (request.containsKey("status")) {
            todo.setStatus(request.get("status"));
        }
        
        Todo updatedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(updatedTodo);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        
        if (!todo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        todoRepository.delete(todo);
        return ResponseEntity.ok(Map.of("message", "Todo deleted successfully"));
    }
}
