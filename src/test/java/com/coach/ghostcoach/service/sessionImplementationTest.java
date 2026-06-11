package com.coach.ghostcoach.service;

import com.coach.ghostcoach.exception.FileContentTypeException;
import com.coach.ghostcoach.exception.UploadIsEmptyException;
import com.coach.ghostcoach.exception.UploadSizeException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class sessionImplementationTest {
    @Autowired
    SessionService session;



    @Test
    void testThatPlayerCanNotUploadEmptyImage(){
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", new byte[0]);
        assertThrows(UploadIsEmptyException.class,()->session.getFeedback(file,"1234"));

    }

    @Test
    void teatThatPlayerCanNotUploadFileBiggerThan5mb(){
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", new byte[10*1024*1024]);
        assertThrows(UploadSizeException.class,()->session.getFeedback(file,"1234"));
    }

    @Test
    void teatThatPlayerCanNotUploadFileWithWrongType(){
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/jjj", new byte[5*1024*1024]);
        assertThrows(FileContentTypeException.class,()->session.getFeedback(file,"1234"));
    }

    @Test
    void testThatPlayerCanUploadFileAndGetFeedback(){
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", new byte[5*1024*1024]);
        assertNotNull(session.getFeedback(file,"1234"));
    }

}