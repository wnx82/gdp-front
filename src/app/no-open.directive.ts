import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: 'a[no-open]',
})
export class NoOpenDirective {
    @HostListener('click', ['$event'])
    onClickLink() {
        console.log('stop');
        return false;
    }
}
