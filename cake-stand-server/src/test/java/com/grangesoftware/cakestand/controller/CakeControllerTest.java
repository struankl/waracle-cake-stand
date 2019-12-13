package com.grangesoftware.cakestand.controller;

import com.grangesoftware.cakestand.dto.CakeInputDto;
import com.grangesoftware.cakestand.dto.CakeResponseDto;
import com.grangesoftware.cakestand.model.Cake;
import com.grangesoftware.cakestand.repos.CakeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class CakeControllerTest {

    private final Cake victoriaSponge = new Cake(1l, "Victoria Sponge", "Really nice", "http://example.com/1.jpg", 5);
    private final Cake carrotCake = new Cake(2l, "Carrot Cake", "Vegetables in cake? Really?", "http://example.com/2.jpg", 1);
    private final CakeInputDto mudCakeInput = new CakeInputDto("Mud Cake", "Boop", "http://example.com/2.jpg", 1);

    ModelMapper modelMapper = new ModelMapper();

    @Mock
    CakeRepository repository;

    CakeController testee;

    @BeforeEach
    public void setup() {
        testee = new CakeController(repository, modelMapper);
    }

    @Test
    void getCakesEmtpyList() {
        when(repository.findAll()).thenReturn(Collections.emptyList());

        assertEquals(testee.getCakes().size(), 0);
    }

    @Test
    void getCakesPopulatedList() {
        List<Cake> cakes = Arrays.asList(victoriaSponge, carrotCake);
        when(repository.findAll()).thenReturn(cakes);

        Collection<CakeResponseDto> cakeResponse = testee.getCakes();
        assertEquals(cakeResponse.size(), 2);
        Iterator<CakeResponseDto> cakeIterator = cakeResponse.iterator();
        int i = 0;
        while (cakeIterator.hasNext()) {
            CakeResponseDto cakeResp = cakeIterator.next();
            Cake cake = cakes.get(i++);
            assertCakesEqual(cake, cakeResp);
        }
    }

    @Test
    void getCake() {
        when(repository.findById(1l)).thenReturn(Optional.of(victoriaSponge));
        CakeResponseDto cakeResponse = testee.getCake(1);
        assertCakesEqual(victoriaSponge, cakeResponse);
    }

    @Test
    void getUnknownCake() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> testee.getCake(1));
        assertEquals(NOT_FOUND, exception.getStatus());
    }

    @Test
    void addCake() {
        when(repository.save(any(Cake.class))).thenReturn(victoriaSponge);
        ArgumentCaptor<Cake> argumentCaptor = ArgumentCaptor.forClass(Cake.class);
        CakeInputDto cakeInputDto = new CakeInputDto("Carrot Cake", "Boop", "http://example.com/2.jpg", 1);
        CakeResponseDto cakeResponseDto = testee.addCake(cakeInputDto);
        verify(repository).save(argumentCaptor.capture());
        assertCakesEqual(argumentCaptor.getValue(), cakeInputDto);
        assertCakesEqual(victoriaSponge, cakeResponseDto);
    }

    @Test
    void updateCake() {
        when(repository.save(any(Cake.class))).thenReturn(victoriaSponge);
        when(repository.existsById(2l)).thenReturn(true);
        ArgumentCaptor<Cake> argumentCaptor = ArgumentCaptor.forClass(Cake.class);
        CakeResponseDto cakeResponseDto = testee.updateCake(2, mudCakeInput);
        verify(repository).save(argumentCaptor.capture());
        Cake saveCake = argumentCaptor.getValue();
        assertEquals(2, saveCake.getId());
        assertCakesEqual(saveCake, mudCakeInput);
        assertCakesEqual(victoriaSponge, cakeResponseDto);
    }

    @Test
    void updateUnknownCake() {
        when(repository.existsById(3l)).thenReturn(false);
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> testee.updateCake(3, mudCakeInput));
        assertEquals(NOT_FOUND, exception.getStatus());
    }

    @Test
    void deleteCake() {
        ArgumentCaptor<Long> argumentCaptor = ArgumentCaptor.forClass(Long.class);
        when(repository.existsById(3l)).thenReturn(true);
        testee.deleteCake(3);
        verify(repository).deleteById(argumentCaptor.capture());
        assertEquals(3, argumentCaptor.getValue());
    }

    @Test
    void deleteUnknownCake() {
        when(repository.existsById(3l)).thenReturn(false);
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> testee.deleteCake(3));
        assertEquals(NOT_FOUND, exception.getStatus());
    }

    void assertCakesEqual(Cake cake, CakeResponseDto cakeResponse) {
        assertEquals(cake.getId(), cakeResponse.getId());
        assertEquals(cake.getName(), cakeResponse.getName());
        assertEquals(cake.getComment(), cakeResponse.getComment());
        assertEquals(cake.getImageUrl(), cakeResponse.getImageUrl());
        assertEquals(cake.getYumFactor(), cakeResponse.getYumFactor());
    }

    void assertCakesEqual(Cake cake, CakeInputDto cakeInput) {
        assertEquals(cake.getName(), cakeInput.getName());
        assertEquals(cake.getComment(), cakeInput.getComment());
        assertEquals(cake.getImageUrl(), cakeInput.getImageUrl());
        assertEquals(cake.getYumFactor(), cakeInput.getYumFactor());
    }
}
