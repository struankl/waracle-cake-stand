package com.grangesoftware.cakestand.dto;

import java.io.Serializable;

public class CakeInputDto implements Serializable {

    public CakeInputDto() {}

    public CakeInputDto(String name, String comment, String imageUrl, int yumFactor) {
        this.name = name;
        this.comment = comment;
        this.imageUrl = imageUrl;
        this. yumFactor = yumFactor;
    };

    private String name;

    private String comment;

    private String imageUrl;

    private int yumFactor;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getYumFactor() {
        return yumFactor;
    }

    public void setYumFactor(int yumFactor) {
        this.yumFactor = yumFactor;
    }}
