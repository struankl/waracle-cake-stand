package com.grangesoftware.cakestand.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
@Table(name = "cakes")
public class Cake implements Serializable {

    public Cake () {};

    public Cake(long id, String name, String comment, String imageUrl, int yumFactor) {
        this.id = id;
        this.name = name;
        this.comment = comment;
        this.imageUrl = imageUrl;
        this. yumFactor = yumFactor;
    }

    @Id
    @GeneratedValue
    private long id;

    @Column
    private String name;

    @Column
    private String comment;

    @Column(name = "imageurl")
    private String imageUrl;

    @Column(name = "yumfactor")
    private int yumFactor;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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
    }
}
