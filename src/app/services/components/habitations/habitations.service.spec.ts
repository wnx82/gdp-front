import { TestBed } from '@angular/core/testing';

import { HabitationsService } from './habitations.service';

describe('HabitationsService', () => {
    let service: HabitationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HabitationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
