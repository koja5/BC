import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
  name: "connectionPipe",
})
export class ConnectionFilterPipe implements PipeTransform {
  transform(value: any, searchTerm: string) {
    console.log("test1234");
    if (!value || !searchTerm) {
      return value;
    }

    return value.filter(
      (value) =>
        value.fullname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        (value.looking &&
          value.looking.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1) ||
        (value.offer &&
          value.offer.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
        (value.profession &&
          value.profession.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1) ||
        (value.aboutMe &&
          value.aboutMe.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
    );
  }
}
