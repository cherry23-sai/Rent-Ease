package com.rentease.dto;

import com.rentease.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private User.Role role;
    private User.Status status;

    public static ProfileDto fromEntity(User u) {
        return ProfileDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .address(u.getAddress())
                .role(u.getRole())
                .status(u.getStatus())
                .build();
    }
}
