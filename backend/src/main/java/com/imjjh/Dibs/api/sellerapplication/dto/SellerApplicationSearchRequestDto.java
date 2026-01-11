package com.imjjh.Dibs.api.sellerapplication.dto;

import com.imjjh.Dibs.common.dto.PageableRequest;

public record SellerApplicationSearchRequestDto(
        Integer page,

        Integer size
)
implements PageableRequest { }
