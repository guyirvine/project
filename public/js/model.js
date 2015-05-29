
function Project(n) {
  var self=this;

  self.name=ko.observable(n);
}

function Outcome(id, n) {
  var self=this;

  self.id = id;
  self.name=ko.observable(n);
}

function Persona(id, n) {
  var self=this;

  self.id = id;
  self.name=ko.observable(n);
}

function Hypothesis(o, p, d) {
  var self=this;

  self.outcome=ko.observable(o);
  self.persona=ko.observable(p);
  self.description=ko.observable(d);

  self.click = function(e) {
    vm.show_form('hypothesis');
    $( 'div.hypothesis textarea' ).focus();

    ko.applyBindings(self, $('div.form')[0]);
  };
  self.close = function(e) {
    vm.close_form();
  };
}

function HypothesisViewModel() {
  var self=this;

  self.project_name = ko.observable( 'Jimbo' );
  self.page_name = ko.computed( function() {
    return self.project_name();
  });

  self.outcome_list = ko.observableArray();
  self.outcome_idx = {};
  self.persona_list = ko.observableArray();
  self.persona_idx = {};
  self.hypothesis_list = ko.observableArray();
  self.hypothesis_idx = {};
  self.list = ko.observableArray();

  self.addnew = function() {
    self.show_form('hypothesis');
    $( 'div.hypothesis textarea' ).focus();

    ko.applyBindings(self, $('div.form')[0]);
  };

  self.add = function(o_id, o, d) {
    self.list.push( new Hypothesis(o_id, o, d) );
  };

  self.add_outcome=function(o) {
    self.outcome_list.push(o);
    self.outcome_idx[o.id]=o;
  };
  self.add_persona=function(p) {
    self.persona_list.push(p);
    self.persona_idx[p.id]=p;
  };
  self.add_hypothesis=function(h) {
    self.hypothesis_list.push(h);
    self.hypothesis_idx[h.id]=h;
  };

  self.show_form=function(c) {
  	$( "body" ).addClass( "showForm" );
  	$( "div." + c ).removeClass( "hide" );
  };
  self.close_form=function() {
  	$( "body" ).removeClass( "showForm" );
  	$( "div.form" ).addClass( "hide" );
    ko.cleanNode($('div.form')[0]);
  };

  self.get_for_project = function(id) {
    $.when(
      $.get('/project/' + id),
      $.get('/project/' + id + '/outcome'),
      $.get('/project/' + id + '/persona')
    ).done(function( project_data, outcome_data, persona_data ) {
      _.each(JSON.parse( outcome_data[0] ), function(el) {
        self.add_outcome( new Outcome( el.id, el.name ) );
      });

      _.each(JSON.parse( persona_data[0] ), function(el) {
        self.add_persona(new Persona( el.id, el.name ));
      });

      $.get( '/project/' + id + '/hypothesis', function(data) {
        var list = JSON.parse( data );
        _.each( list, function(el) {
          var o=self.outcome_idx[el.outcome_id];
          var p=self.persona_idx[el.persona_id];

          self.add_hypothesis(new Hypothesis(o, p, el.description));
        });
      });
    });
  };
}
