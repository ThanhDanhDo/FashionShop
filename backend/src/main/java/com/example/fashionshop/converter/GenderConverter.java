package com.example.fashionshop.converter;

import com.example.fashionshop.enums.Gender;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, String> {

    @Override
    public String convertToDatabaseColumn(Gender gender) {
        // Nếu giá trị null thì trả về null
        if (gender == null) {
            return null;
        }
        // Chuyển đổi enum thành chuỗi (có thể điều chỉnh nếu cần)
        return gender.name();
    }

    @Override
    public Gender convertToEntityAttribute(String dbData) {
        // Nếu dữ liệu từ DB null thì trả về null
        if (dbData == null) {
            return null;
        }
        return Gender.valueOf(dbData);
    }
}
