package com.grangesoftware.cakestand.controller;

import com.grangesoftware.cakestand.dto.CakeInputDto;
import com.grangesoftware.cakestand.dto.CakeResponseDto;
import com.grangesoftware.cakestand.model.Cake;
import com.grangesoftware.cakestand.repos.CakeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping("/cakes")
@CrossOrigin( origins = "*")
public class CakeController {

    private final CakeRepository cakeRepository;
    private final ModelMapper modelMapper;

    public CakeController(CakeRepository cakeRepository, ModelMapper modelMapper) {
        this.cakeRepository = cakeRepository;
        this.modelMapper = modelMapper;
    }

    @RequestMapping(method = GET)
    public Collection<CakeResponseDto> getCakes() {
        Collection<Cake> cakes = cakeRepository.findAll();
        return cakes
                .stream()
                .map(cake -> modelMapper.map(cake, CakeResponseDto.class))
                .collect(toList());
    }

    @RequestMapping(path = "/{id}", method = GET)
    public CakeResponseDto getCake(@PathVariable("id") long id) {
        Cake cake = cakeRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "cake not found"));
        return modelMapper.map(cake, CakeResponseDto.class);
    }

    @RequestMapping(method = POST)
    public CakeResponseDto addCake(@RequestBody CakeInputDto cake) {
        Cake cakeEntity = modelMapper.map(cake, Cake.class);
        cakeEntity = cakeRepository.save(cakeEntity);
        return modelMapper.map(cakeEntity, CakeResponseDto.class);
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public CakeResponseDto updateCake(@PathVariable("id") long id, @RequestBody CakeInputDto cake) {
        if (!cakeRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "cake not found");
        }
        Cake cakeEntity = modelMapper.map(cake, Cake.class);
        cakeEntity.setId(id);
        cakeEntity = cakeRepository.save(cakeEntity);
        return modelMapper.map(cakeEntity, CakeResponseDto.class);
    }

    @RequestMapping(path = "/{id}", method = DELETE)
    @ResponseStatus(NO_CONTENT)
    public void deleteCake(@PathVariable("id") long id) {
        if (!cakeRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "cake not found");
        }
        cakeRepository.deleteById(id);
    }
}
