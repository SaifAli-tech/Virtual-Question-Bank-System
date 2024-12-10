// PageOptionsDto
class PageOptionsDto {
  constructor({
    page = 1,
    take = 10,
    orderBy = "",
    order = "ASC",
    search = "",
    skip = 0,
    filter = "",
    difficulty = "",
  }) {
    this.page = page;
    this.take = take;
    this.orderBy = orderBy;
    this.order = order;
    this.search = search;
    this.skip = skip;
    this.filter = filter;
    this.difficulty = difficulty;

    if (this.page !== 1) {
      this.skip = (this.page - 1) * this.take;
    }
  }
}

// PageMetaDto
class PageMetaDto {
  constructor({ pageOptionsDto, itemCount }) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

// PageDto
class PageDto {
  constructor(pagedata, meta) {
    this.pagedata = pagedata;
    this.meta = meta;
  }
}

module.exports = {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
};
