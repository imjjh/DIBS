package com.imjjh.Dibs.api.sellerapplication.dto;

import com.imjjh.Dibs.common.dto.PageableRequest;

public record SellerApplicationSearchRequestDto(
                @Override Integer page,

                @Override Integer size)
                implements PageableRequest {
}
