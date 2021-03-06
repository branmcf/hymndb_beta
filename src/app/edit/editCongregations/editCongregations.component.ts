import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SubmitService } from './../../services/submit.service';
import { ReviewService } from './../../services/review.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'hymn-edit-congregation',
  templateUrl: './editCongregations.html',
  styleUrls: ['./editCongregations.scss']

})

export class EditCongregationsComponent implements OnInit {
  id: number;
  approved: boolean;
  deleted: boolean;
  congregation: any;
  submission: any;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    public dialog: MdDialog,) {
  }

  openDialog(congregation) {
    let dialogRef = this.dialog.open(CongDialog, {
      disableClose: false,
      width: '90%',
      height: '90%',
    });
    dialogRef.componentInstance.passedCong = congregation;
    this.createObject(congregation);
    dialogRef.afterClosed().subscribe(result => {
        if (result === 'submitEdit') {
            this.submitEdit(congregation);
        }
        else {
            window.location.reload(true);
        }
    });
  }

  createObject(congregation) {
      const ethnicities = {};
      const categories = {};
      const instruments = {};
      const shape = {};
      const clothing = {};

      for(const i of congregation.data.ethnicities) {
        ethnicities[i] = true;
      }
      for(const i of congregation.data.categories) {
        categories[i] = true;
      }
      for(const i of congregation.data.instruments) {
        instruments[i] = true;
      }
      for(const i of congregation.data.shape) {
        shape[i] = true;
      }
      for(const i of congregation.data.clothing) {
        clothing[i] = true;
      }
  }

  ngOnInit() {
    this.route.params.forEach(x => this.load(+x['id']));
    this.submission = {};
  }

    private load(id){
        if(!id) {
            return;
        }

        var onload = (data) => {
            if (data) {
                this.id = id;
                this.congregation = data;
            }
        };
        this.reviewService.getCongregationByID(id).then(onload);
    }

    approve(id) {
        this.reviewService.approveCongregation(this.id).then(() => {
            this.router.navigate(['/review/congregations']);
        });
    }

    edit() {
        this.openDialog(this.congregation);
    }

    submitEdit(congregation) {
        this.submission.data = congregation.data;
        this.submission.user = congregation.user;

        this.reviewService.editCongregation(this.id, this.submission).then(() => {
            this.router.navigate(['/review/congregations']);
        });
    }

    delete(id) {
        this.reviewService.deleteCongregation(this.id).then(() => {
            this.router.navigate(['/review/congregations']);
        });
    }
}

@Component({
  selector: 'organization-dialog',
  template:`
      <div>
        <form>
            <h1 md-dialog-title>Edit Event</h1>

            <div class="form-group">
                <label for="congName">
                    Congregation Name
                </label>
                <input type="text" 
                class="full-width"
                id="congregationName" 
                class="form-control" 
                [(ngModel)]="passedCong.data.name"
                name="congregationName"/>
            </div>

            <br>

            <div class="form-group">
                <label>
                    Congregation Website
                </label>
                <input type="url" 
                class="full-width"
                id="congregationUrl" 
                class="form-control" 
                [(ngModel)]="passedCong.data.url"
                name="congregationUrl"/>
            </div>

            <br>

            <div class="form-group">
                <label for="congCountry">
                    Congregation Country
                </label>
                <input type="text" 
                class="full-width"
                id="congregationCountry" 
                class="form-control" 
                [(ngModel)]="passedCong.data.country"
                name="congregationCountry"/>
            </div>   

            <br> 

            <div class="form-group">
                <label for="congState">
                    Congregation State
                </label>
                <input type="text" 
                class="full-width"
                id="congregationState" 
                class="form-control" 
                [(ngModel)]="passedCong.data.state"
                name="congregationState"/>
            </div>  

            <br> 

            <div class="form-group">
                <label for="congCity">
                    Congregation City
                </label>
                <input type="text" 
                class="full-width"
                id="congregationCity" 
                class="form-control" 
                [(ngModel)]="passedCong.data.city"
                name="congregationCity"/>
            </div>

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationDenom">Denomination/Tradition</legend>
                <md-radio-group [(ngModel)]="passedCong.data.denomination" name="congregationDenom" required>
                    <md-radio-button class="block-input" value="Roman Catholic" required>Roman Catholic</md-radio-button>
                    <md-radio-button class="block-input" value="Anglican" >Anglican/Episcopal</md-radio-button>
                    <md-radio-button class="block-input" value="Lutheran" >Lutheran</md-radio-button>
                    <md-radio-button class="block-input" value="Wesleyan (United Methodist, AME, etc...)" >Wesleyan (United Methodist, AME, etc...)</md-radio-button>
                    <md-radio-button class="block-input" value="Reformed (Presbyterian, RCA, etc...)" >Reformed (Presbyterian, RCA, etc...)</md-radio-button>
                    <md-radio-button class="block-input" value="Baptist/Free-Church" >Baptist/Free-Church</md-radio-button>
                    <md-radio-button class="block-input" value="Pentecostal" >Pentecostal</md-radio-button>
                    <md-radio-button class="block-input" value="Non-Denominational" >Non-Denominational</md-radio-button>
                    <md-radio-button class="block-input" value="other">   
                        <label for="congDenom">
                            Other Denomination/Tradion
                        </label>
                        <input type="text"
                        [(ngModel)]="denomOther"
                        name="otherDenom"/>
                    </md-radio-button>
                </md-radio-group>
                </fieldset>
            </div>

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationMembers">Are there any Hymn Society members in your congregation or on your church staff?</legend>
                <md-radio-group [(ngModel)]="passedCong.data.hymn_soc_member" name="congregationMember" required>
                    <md-radio-button class="block-input" name="hymn_soc_member" value="true" required>Yes</md-radio-button>
                    <md-radio-button class="block-input" name="hymn_soc_member" value="false">No</md-radio-button>
                </md-radio-group>
                </fieldset>
            </div>

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationTypes">Which types of song/hymn(s) has your congregation sung in the last 2 months?</legend>
                    <md-checkbox class="block-input" 
                        ng-true-value="true" 
                        ng-false-value="false"
                        [(ngModel)]="passedCong.data.categories['A hymn written prior to 1970']"
                        name="personTypeOne"
                        >A hymn written prior to 1970</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeTwo"
                        [(ngModel)]="passedCong.data.categories['Newly composed hymn (within the last 10 years)']"
                        >Newly composed hymn (within the last 10 years)</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeNine"
                        [(ngModel)]="passedCong.data.categories['A song written by our own artist/leader']"
                        >A song written by our own artist/leader</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeThree"
                        [(ngModel)]="passedCong.data.categories['Praise and Worship Song (CCM)']"
                        >Praise and Worship Song (CCM)</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeFour"
                        [(ngModel)]="passedCong.data.categories['Psalm Setting']"
                        >Psalm Setting</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeFive"
                        [(ngModel)]="passedCong.data.categories['Chant (Gregorian, Anglican, Pointed or Taize)']"
                        >Chant (Gregorian, Anglican, Pointed or Taize)</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeSix"
                        [(ngModel)]="passedCong.data.categories['Older hymn text set to a new contemporary tune (or re-tuned)']"
                        >Older hymn text set to a new contemporary tune (or 're-tuned')</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeSeven"
                        [(ngModel)]="passedCong.data.categories['Song from another country (or World Song)']"
                        >Song from another country (or 'World Song')</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeEight"
                        [(ngModel)]="passedCong.data.categories['Secular Song']"
                        >Secular Song</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personTypeEight"
                        [(ngModel)]="passedCong.data.categories['Liturgical Music']"
                        >Liturgical Music</md-checkbox>
                    <md-checkbox class="block-input">    
                        <label for="congTypeOther">
                            Other Type
                        </label>                    
                        <input tpye="text" 
                        class="full-width"
                        id="congregationCategoryOther" 
                        class="form-control" 
                        [(ngModel)]="passedCong.data.categories.Other"
                        name="congregationCategoryOther"/>
                    </md-checkbox>
                    </fieldset>
            </div>

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationInstruments">Which types of instruments does your congregation use during congregational singing?</legend>
                    <md-checkbox class="block-input" 
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentOne"
                        [(ngModel)]="passedCong.data.instruments['Acappella']">
                        Acappella</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentTwo"
                        [(ngModel)]="passedCong.data.instruments['Organ']">
                        Organ</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentThree"
                        [(ngModel)]="passedCong.data.instruments['Piano']">
                        Piano</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentFour"
                        [(ngModel)]="passedCong.data.instruments['Guitar (not full band)']">
                        Guitar (not full band)</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentFive"
                        [(ngModel)]="passedCong.data.instruments['Band (guitar, bass, drums, etc...)']">
                        Band (guitar, bass, drums, etc...)</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentSix"
                        [(ngModel)]="passedCong.data.instruments['Orchestra/Wind Ensemble']">
                        Orchestra/Wind Ensemble</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentSeven"
                        [(ngModel)]="passedCong.data.instruments['Handbells']">
                        Handbells</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentEight"
                        [(ngModel)]="passedCong.data.instruments['Obligato Instruments (flute, clarinet, trumpet, etc...)']">
                        Obligato Instruments (flute, clarinet, trumpet, etc...)</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentEight"
                        [(ngModel)]="passedCong.data.instruments['Descants']">
                        Descants</md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true" 
                        ng-false-value="false"
                        name="personInstrumentTen"
                        [(ngModel)]="passedCong.data.instruments['Pre-Recorded Tracks/Accompaniments']">
                        Pre-Recorded Tracks/Accompaniments</md-checkbox>
                    <md-checkbox class="block-input">       
                        <label for="congInstrOther">
                            Other Instruments  
                        </label>                 
                        <input type="text" 
                        class="full-width"
                        id="congregationInstruments" 
                        class="form-control" 
                        [(ngModel)]="passedCong.data.instruments.Other"
                        name="congregationInstrumentOther"/>
                    </md-checkbox>
                </fieldset>
            </div>

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationShape">Which best describes the shape of your worship?</legend>
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="shapeOne"
                    [(ngModel)]="passedCong.data.shape['5-Fold Pattern']">
                    5-Fold Pattern (Gathering, Word, Response, Table, Sending) - Roman Catholic Mass and similar structures
                </md-checkbox>
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="shapeTwo"
                    [(ngModel)]="passedCong.data.shape['4-Fold Pattern']">
                    4-Fold Pattern (Gathering, Word, Response, Sending) - Communion monthly or quarterly"
                </md-checkbox>
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="shapeThree"
                    [(ngModel)]="passedCong.data.shape['2-Fold Pattern']">
                    2-Fold Pattern (Praise & Teaching) - Most Praise and Worship services
                </md-checkbox>
                <md-checkbox class="block-input">    
                    <label>
                        Other Shape
                    </label>                    
                    <input type="text" 
                    class="full-width"
                    id="congregationShape" 
                    class="form-control" 
                    [(ngModel)]="passedCong.data.shape.Other"
                    name="congregationShapeOther"/>
                </md-checkbox>
                </fieldset>
            </div> 

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationAttire">What does your pastor/priest wear when he/she preaches?</legend>        
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="congregationAttireFive"
                    [(ngModel)]="passedCong.data.clothing['Vestments']">
                    Vestments</md-checkbox>
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="congregationAttireSix"
                    [(ngModel)]="passedCong.data.clothing['Robes, with or without stoles']">
                    Robes, with or without stoles</md-checkbox>
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="congregationAttireSeven"
                    [(ngModel)]="passedCong.data.clothing['Business Attire']">
                    Business Attire</md-checkbox>
                <md-checkbox class="block-input"
                    ng-true-value="true" 
                    ng-false-value="false"
                    name="congregationAttireEight"
                    [(ngModel)]="passedCong.data.clothing['Casual']">
                    Casual</md-checkbox>
                <md-checkbox class="block-input">
                    <label for="congAttireOther">
                        Other Forms of Attire
                    </label>                        
                    <input type="text" 
                    class="full-width"
                    id="congregationAttire" 
                    class="form-control" 
                    [(ngModel)]="passedCong.data.clothing.Other"
                    name="congregationAttireOther"/>
                </md-checkbox>
                </fieldset>
            </div>     

            <br>  
                    
            <div class="form-group">
                <fieldset>
                <legend for="congregationLocation">Is your congregation...</legend>
                <md-radio-group [(ngModel)]="passedCong.data.geography" name="congregationLocation" required>
                    <md-radio-button class="block-input"
                        value="Urban (downtown churches in a large metropolitan area)">
                        Urban (downtown churches in a large metropolitan area)</md-radio-button>
                    <md-radio-button class="block-input" 
                        value="Suburban"> 
                        Suburban</md-radio-button>
                    <md-radio-button class="block-input"
                        value="Rural - In a small city"> Rural - In a small city</md-radio-button>
                    <md-radio-button class="block-input"
                        value="Rural - Not in a city"> 
                        Rural - Not in a city</md-radio-button>
                    <md-radio-button class="block-input" value="other"> 
                        <label fr="congGeoOther">
                            Other
                        </label>  
                        <input tpye="text"
                        [(ngModel)]="geographyOther"
                        name="otherGeography"/>
                    </md-radio-button>
                </md-radio-group>
                </fieldset>
            </div>     

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationEthnicity">What ethnicities/races make up at least 20% of your congregation?</legend>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFive"
                        [(ngModel)]="passedCong.data.ethnicities['Asian - Chinese Language/Heritage']">
                        Asian - Chinese Language/Heritage
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFive"
                        [(ngModel)]="passedCong.data.ethnicities['Asian - Indian']">
                        Asian - Indian
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFive"
                        [(ngModel)]="passedCong.data.ethnicities['Asian - Southeast Asian Non-Chinese']">
                        Asian - Southeast Asian Non-Chinese
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFive"
                        [(ngModel)]="passedCong.data.ethnicities['Asian - Korean']">
                        Asian - Korean
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFive"
                        [(ngModel)]="passedCong.data.ethnicities['Asian - Japanese']">
                        Asian - Japanese
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicitySix"
                        [(ngModel)]="passedCong.data.ethnicities['Black - African-American']">
                        Black - African-American
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicitySix"
                        [(ngModel)]="passedCong.data.ethnicities['Black - Sub-Saharan African']">
                        Black - Sub-Saharan African
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFour"
                        [(ngModel)]="passedCong.data.ethnicities['Hispanic/Latino/Spanish - Central/South American']">
                        Hispanic/Latino/Spanish - Central/South American
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityFour"
                        [(ngModel)]="passedCong.data.ethnicities['Hispanic/Latino/Spanish - Caribbean']">
                        Hispanic/Latino/Spanish - Caribbean
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicitySeven"
                        [(ngModel)]="passedCong.data.ethnicities['Native American/Indigenous Peoples']">
                        Native American/Indigenous Peoples
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicitySeven"
                        [(ngModel)]="passedCong.data.ethnicities['Native American/Pacific Islander']">
                        Native American/Pacific Islander
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicitySeven"
                        [(ngModel)]="passedCong.data.ethnicities['North African/Middle Eastern']">
                        North African/Middle Eastern
                    </md-checkbox>
                    <md-checkbox class="block-input"
                        ng-true-value="true"
                        ng-false-value="false"
                        name="congregationEthnicityOne"
                        [(ngModel)]="passedCong.data.ethnicities['White']">
                        White
                    </md-checkbox>
                    <md-checkbox class="block-input">
                        <label>
                            Other Ethnicity
                        </label>
                        <input type="text" 
                        class="full-width"
                        id="congregationEnsemble" 
                        class="form-control" 
                        name="congregationEthnicityEight"
                        [(ngModel)]="passedCong.data.ethnicities.Other"/>
                    </md-checkbox>
                </fieldset>
            </div>

            <br>

            <div class="form-group">
                <fieldset>
                <legend for="congregationAttendance">On average, how many people attend your weekly worship services?</legend>
                <md-radio-group [(ngModel)]="passedCong.data.attendance" name="congAttendance" required>
                    <md-radio-button class="block-input" value="Under 100" required> Under 100</md-radio-button>
                    <md-radio-button class="block-input" value="Between 100 and 250"> Between 100 and 250</md-radio-button>
                    <md-radio-button  class="block-input" value="Between 250 and 500"> Between 250 and 500</md-radio-button>
                    <md-radio-button  class="block-input" value="Between 500 and 1000"> Between 500 and 1000</md-radio-button>
                    <md-radio-button  class="block-input" value="Over 1000"> Over 1000</md-radio-button>
                </md-radio-group>
                </fieldset>
            </div>

            <br>

            <md-card-actions>
              <button md-raised-button color="primary" type="submit" (click)="bind(); dialogRef.close('submitEdit');">
                Submit
              </button>
              <button md-button md-dialog-close>
                Cancel
              </button>
            </md-card-actions>

        </form>  
    </div>    

    `
  ,
  styleUrls: ['./editCongregations.scss']
})

export class CongDialog {
    passedCong: any;

    denomOther: string;
    geographyOther: string;

    categoriesOther: any;
    instrumentsOther: any;
    shapeOther: any;
    clothingOther: any;
    ethnicitiesOther: any;

    constructor(public dialogRef: MdDialogRef<CongDialog>) {
    }

    ngOnInit() {
        this.checkOther();
    }

    checkOther() {
        for(const category of Object.keys(this.passedCong.data.categories)) {
            if(category !== 'Secular Song'
            && category !== 'Psalm Setting'
            && category !== 'Liturgical Music'
            && category !== 'A hymn written prior to 1970'
            && category !== 'Praise and Worship Song (CCM)'
            && category !== 'A song written by our own artist/leader'
            && category !== 'Chant (Gregorian, Anglican, Pointed or Taize)'
            && category !== 'Newly composed hymn (within the last 10 years)'
            && category !== 'World Song (a song not from the U.S. or Canada)'
            && category !== 'Older hymn text set to a new contemporary tune (or re-tuned)') {
                this.categoriesOther = category;
                this.passedCong.data.categories.Other = category;
            }
        }

        for(const clothing of Object.keys(this.passedCong.data.clothing)) {
            if(clothing !== 'Vestments'
            && clothing !== 'Robes, with or without stoles'
            && clothing !== 'Business Attire'
            && clothing !== 'Casual') {
                this.clothingOther = clothing;
                this.passedCong.data.clothing.Other = clothing;
            }
        }

        for(const ethnicity of Object.keys(this.passedCong.data.ethnicities)) {
            if(ethnicity !== 'White'
            && ethnicity !== 'Asian - Indian'
            && ethnicity !== 'Asian - Korean'
            && ethnicity !== 'Asian - Japanese'
            && ethnicity !== 'Black - African-American'
            && ethnicity !== 'Black - Sub-Saharan African'
            && ethnicity !== 'North African/Middle Eastern'
            && ethnicity !== 'Native American/Pacific Islander'
            && ethnicity !== 'Asian - Chinese Language/Heritage'
            && ethnicity !== 'Native American/Indigenous Peoples'
            && ethnicity !== 'Asian - Southeast Asian Non-Chinese'
            && ethnicity !== 'Hispanic/Latino/Spanish - Caribbean'
            && ethnicity !== 'Hispanic/Latino/Spanish - Central/South American') {
                this.ethnicitiesOther = ethnicity;
                this.passedCong.data.ethnicities.Other = ethnicity;
            }
        }

        for(const instrument of Object.keys(this.passedCong.data.instruments)) {
            if(instrument !== 'Organ'
            && instrument !== 'Piano'
            && instrument !== 'Descants'
            && instrument !== 'Acappella'
            && instrument !== 'Handbells'
            && instrument !== 'Guitar (not full band)'
            && instrument !== 'Orchestra/Wind Ensemble'
            && instrument !== 'Band (guitar, bass, drums, etc...)'
            && instrument !== 'Pre-Recorded Tracks/Accompaniments'
            && instrument !== 'Obligato Instruments (flute, clarinet, trumpet, etc...)') {
                this.instrumentsOther = instrument;
                this.passedCong.data.instruments.Other = instrument;
            }
        }

        for(const shape of Object.keys(this.passedCong.data.shape)) {
            if(shape !== '5-Fold Pattern'
            && shape !== '4-Fold Pattern'
            && shape !== '2-Fold Pattern') {
                this.shapeOther = shape;
                this.passedCong.data.shape.Other = shape;
            }
        }
    }

    bind() {
        if (this.denomOther) {
        this.passedCong.data.denomination = this.denomOther;
        }
        if (this.geographyOther) {
        this.passedCong.data.geography = this.geographyOther;
        }

        delete this.passedCong.data.categories[this.categoriesOther];
        delete this.passedCong.data.clothing[this.clothingOther];
        delete this.passedCong.data.ethnicities[this.ethnicitiesOther];
        delete this.passedCong.data.instruments[this.instrumentsOther];
        delete this.passedCong.data.shape[this.shapeOther];
    }
}
