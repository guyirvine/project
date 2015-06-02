
function Project(id, n) {
  var self=this;

  self.id=id;
  self.name=ko.observable(n);
  self.selected=ko.observable(false);

  self.select_project = function() {
    vm.show_project( self.id );
  };
}

function Outcome(id, n, d) {
  var self=this;

  self.id = id;
  self.name=ko.observable(n);
  self.description=ko.observable(d);

  self.select_outcome = function() {
    console.log( "select_outcome" );
  };
}

function Backlog(id, n, d) {
  var self=this;

  self.id = id;
  self.name=ko.observable(n);
  self.description=ko.observable(d);

  self.select_backlog = function() {
    console.log( "select_backlog" );
  };
}

function Persona(id, n) {
  var self=this;

  self.id = id;
  self.name=ko.observable(n);

  self.select_persona = function() {
    console.log( "select_persona" );
  };
}

function Hypothesis(o, p, d) {
  var self=this;

  self.outcome=ko.observable(o);
  self.persona=ko.observable(p);
  self.description=ko.observable(d);

  self.click = function(e) {
    $( "section" ).addClass( "hide" );
    $( "section.form" ).html( $( "div.hypothesis-form" ).html() );
    $( "section.form" ).removeClass( "hide" );

    $( 'section.form textarea' ).focus();
    ko.applyBindings(self, $('section.form')[0]);
  };
  self.close = function(e) {
    $( "section" ).addClass( "hide" );
    ko.cleanNode($('section.form')[0]);
    $( "section.hypothesis" ).removeClass( "hide" );
  };
}

function HypothesisViewModel() {
  var self=this;

  self.project_list = ko.observableArray();
  self.project_idx = {};

  self.current_project = ko.observable();
  self.page_name = ko.computed( function() {
    if ( self.current_project() === undefined ) { return ""; }

    return self.current_project().name();
  });

  self.outcome_list = ko.observableArray();
  self.outcome_idx = {};
  self.persona_list = ko.observableArray();
  self.persona_idx = {};
  self.backlog_list = ko.observableArray();
  self.backlog_idx = {};
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

  self.add_project=function(p) {
    self.project_list.push(p);
    self.project_idx[p.id]=p;
  };
  self.add_outcome=function(o) {
    self.outcome_list.push(o);
    self.outcome_idx[o.id]=o;
  };
  self.add_backlog=function(b) {
    self.backlog_list.push(b);
    self.backlog_idx[b.id]=b;
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
    if ( vm.current_project() !== undefined ) {
      vm.current_project().selected( false );
    }
    $.when(
      $.get('/project/' + id + '/outcome'),
      $.get('/project/' + id + '/backlog'),
      $.get('/project/' + id + '/persona'),
      $.get('/project/' + id + '/hypothesis')
    ).done(function( outcome_data, backlog_data, persona_data, hypothesis_data ) {
      self.current_project( self.project_idx[id] );
      vm.current_project().selected( true );

      self.outcome_list.removeAll();
      _.each(JSON.parse( outcome_data[0] ), function(el) {
        self.add_outcome( new Outcome( el.id, el.name, el.description ) );
      });

      self.backlog_list.removeAll();
      _.each(JSON.parse( backlog_data[0] ), function(el) {
        self.add_backlog( new Backlog( el.id, el.name, el.description ) );
      });

      self.persona_list.removeAll();
      _.each(JSON.parse( persona_data[0] ), function(el) {
        self.add_persona(new Persona( el.id, el.name ));
      });

      self.hypothesis_list.removeAll();
      _.each( JSON.parse( hypothesis_data[0] ), function(el) {
        var o=self.outcome_idx[el.outcome_id];
        var p=self.persona_idx[el.persona_id];

        self.add_hypothesis(new Hypothesis(o, p, el.description));
      });
    });
  };

  self.show_project = function(id) {
    vm.get_for_project( id );
    self.show( "hypothesis" );
  };

  self._show = function( c ) {
    $( "section" ).addClass( "hide" );
    $( "section." + c ).removeClass( "hide" );

    $( "div.body header nav a" ).removeClass( "selected" );
    $( "div.body header nav a." + c ).addClass( "selected" );
  };

  self.show = function( c ) {
    self._show( c );
    history.pushState( { "view": c }, 'c', "#" + c );
  };

  self.popstate = function( state ) {
    if ( state === null || state.view === null ) {
      return;
    }

    switch ( state.view ) {
      case "result":
        break;
      default:
        self._show(state.view);
    }
  };


  $.get('/project', function(project_list_data) {
    _.each(JSON.parse( project_list_data ), function(el) {
      self.add_project( new Project( el.id, el.name ) );
    });
    self.project_list()[0].select_project();
  });
}
