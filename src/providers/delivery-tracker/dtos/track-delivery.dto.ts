export class TrackDeliveryDto {
  carrier: {
    id: string;
    name: string;
    tel: string;
  };
  from: {
    name: string;
    time: Date;
  };
  to: {
    name: string;
    time: Date;
  };
  state: {
    id: string;
    text: string;
  };
  progresses: {
    time: Date;
    status: {
      id: string;
      text: string;
    };
    location: {
      name: string;
    };
    description: string;
  }[];
}
