import { TestBed } from '@angular/core/testing';

import { PhotouploadfirebaseService } from './photouploadfirebase.service';

describe('PhotouploadfirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhotouploadfirebaseService = TestBed.get(PhotouploadfirebaseService);
    expect(service).toBeTruthy();
  });
});
