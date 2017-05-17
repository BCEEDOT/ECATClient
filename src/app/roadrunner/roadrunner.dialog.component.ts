import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService, ITdDataTableColumn } from '@covalent/core';


@Component({
    selector:'dialog-example',
    template: `
    <h3 md-dialog-title>Simple Dialog</h3>
    <md-dialog-content>
      <p>Apply a <code>md-dialog-title</code> attribute on a heading.</p>
      <p>Use a <code>md-dialog-content</code> element for content.</p>
      <p>Place actions in an <code>md-dialog-actions</code> element.</p>
    </md-dialog-content>
    <md-dialog-actions layout="row" layout-align="end center">
      <button md-button md-dialog-close>Close</button>
    </md-dialog-actions>
  `,
})

export class DialogComponent{}