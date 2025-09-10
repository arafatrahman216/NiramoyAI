package com.example.niramoy.controller;


import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.repository.ChatSessionRepository;
import com.example.niramoy.repository.MessageRepository;
import com.example.niramoy.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/agent")
public class AgentController {
    // can be configured to be used by free users as well
    // registered users can use the /user/chat endpoint

    private final MessageRepository messageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final MessageService messageService;

    @PostMapping("/search")
    public ResponseEntity<HashMap<String,Object>> getAgentSearch(@RequestBody Map<String,String> query){
        HashMap<String,Object> response = new HashMap<>();
        ArrayList <String> list = new ArrayList<>();
        list.add("Well I'll put 50% tarrif on India"); list.add("I am an agent"); list.add("okay, Put 25% tarrif on China");
        list.add("please wait until agent is integrated"); list.add("these are predefine messages");
        list.add("You gonna be shitting me"); list.add("Go to hell");
        list.add("You are dumb"); list.add("You are useless");
        String mess = list.get((int)(Math.random()*list.size())) ;
        Long chatId = Long.parseLong(query.get("chatId") );
        boolean success = messageService.addMessageToChat(chatId, mess, true);
        response.put("data", mess );
        response.put("success", success);
        return ResponseEntity.ok(response);
    }



}
