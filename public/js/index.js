
function Project(id, n) {
  var self=this;

  self.id=id;
  self.name=ko.observable(n);
  self.selected=ko.observable(false);

  self.select_project = function() {
    vm.show_project( self.id );
  };
}

function Outcome(id, p, n, d) {
  var self=this;

  self.id = id;
  self.project = ko.observable(p);
  self.name=ko.observable(n);
  self.description=ko.observable(d);

  self.select_outcome = function() {
    $( "section" ).addClass( "hide" );
    vm.currentOutcome( self );
    $( "section.outcome-form" ).removeClass( "hide" );
    $( 'section.outcome-form input' ).focus();
  };

  self.submit = function(e) {
    $( "section" ).addClass( "hide" );
    $( "section.outcome" ).removeClass( "hide" );

    if ( self.id === null ) {
      vm.add_outcome( self );
    }

    vm.update_outcome( self );
  };
}

function Backlog(id, p, n, d) {
  var self=this;

  self.id = id;
  self.project = ko.observable(p);
  self.name=ko.observable(n);
  self.description=ko.observable(d);

  self.select_backlog = function() {
    $( "section" ).addClass( "hide" );
    vm.currentBacklogItem( self );
    $( "section.backlog-form" ).removeClass( "hide" );
    $( 'section.backlog-form input' ).focus();
  };

  self.submit = function(e) {
    $( "section" ).addClass( "hide" );
    $( "section.backlog" ).removeClass( "hide" );

    if ( self.id === null ) {
      vm.add_backlog( self );
    }
    vm.update_backlog( self );
  };
}

function Persona(id, p, n, r) {
  var self=this;

  self.id = id;
  self.project = ko.observable(p);
  self.name=ko.observable(n);
  self.role=ko.observable(r);

  self.select_persona = function() {
    $( "section" ).addClass( "hide" );
    vm.currentPersona( self );
    $( "section.persona-form" ).removeClass( "hide" );
    $( 'section.persona-form input.name' ).focus();
  };

  self.submit = function(e) {
    $( "section" ).addClass( "hide" );
    $( "section.persona" ).removeClass( "hide" );

    if ( self.id === null ) {
      vm.add_persona( self );
    }

    vm.update_persona( self );
  };
}

function Hypothesis(id, pr, o, p, d) {
  var self=this;

  self.id = id;
  self.project = ko.observable(pr);
  self.outcome=ko.observable(o);
  self.persona=ko.observable(p);
  self.description=ko.observable(d);

  self.select = function(e) {
    $( "section" ).addClass( "hide" );
    vm.currentHypothesis( self );
    $( "section.hypothesis-form" ).removeClass( "hide" );
    $( 'section.hypothesis-form textarea' ).focus();
  };

  self.submit = function(e) {
    $( "section" ).addClass( "hide" );
    $( "section.hypothesis" ).removeClass( "hide" );

    if ( self.id === null ) {
      vm.add_hypothesis( self );
    }

    vm.update_hypothesis( self );
  };
}

function HypothesisViewModel() {
  var self=this;

  self.currentHypothesis = ko.observable();
  self.currentBacklogItem = ko.observable();
  self.currentPersona = ko.observable();
  self.currentOutcome = ko.observable();

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

  self.new_backlogitem = function() {
    var b = new Backlog(null, self.current_project(), "", "");
    b.select_backlog();
  };
  self.new_outcome = function() {
    var o = new Outcome(null, self.current_project(), "", "");
    o.select_outcome();
  };
  self.new_persona = function() {
    var p = new Persona(null, self.current_project(), "", "");
    p.select_persona();
  };
  self.new_hypothesis = function() {
    var h = new Hypothesis(null, self.current_project(), null, null, null);
    h.select();
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

  self.update_outcome = function(o) {
    data = {
      project_id: o.project().id,
      name: o.name(),
      description: o.description()
    };

    if ( o.id === null ) {
      $.post( "/outcome", JSON.stringify(data), function(id) {
        o.id = id;
      });
    } else {
      $.post( "/outcome/" + o.id, JSON.stringify(data), function() {
      });
    }
  };

  self.update_persona = function(p) {
    data = {
      project_id: p.project().id,
      name: p.name(),
      role: p.role()
    };

    if ( p.id === null ) {
      $.post( "/persona", JSON.stringify(data), function(id) {
        p.id = id;
      });
    } else {
      $.post( "/persona/" + p.id, JSON.stringify(data), function() {
      });
    }
  };

  self.update_backlog = function(b) {
    data = {
      project_id: b.project().id,
      name: b.name(),
      description: b.description()
    };

    if ( b.id === null ) {
      $.post( "/backlog", JSON.stringify(data), function(id) {
        b.id=id;
      });
    } else {
      $.post( "/backlog/" + b.id, JSON.stringify(data), function() {
      });
    }
  };

  self.update_hypothesis = function(h) {
    data = {
      project_id: h.project().id,
      outcome_id: h.outcome().id,
      persona_id: h.persona().id,
      description: h.description()
    };

    if ( h.id === null ) {
      $.post( "/hypothesis", JSON.stringify(data), function(id) {
        h.id=id;
      });
    } else {
      $.post( "/hypothesis/" + h.id, JSON.stringify(data), function() {
      });
    }
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
        self.add_outcome( new Outcome( el.id, self.current_project(), el.name, el.description ) );
      });

      self.backlog_list.removeAll();
      _.each(JSON.parse( backlog_data[0] ), function(el) {
        self.add_backlog( new Backlog( el.id, self.current_project(), el.name, el.description ) );
      });

      self.persona_list.removeAll();
      _.each(JSON.parse( persona_data[0] ), function(el) {
        self.add_persona(new Persona( el.id, self.current_project(), el.name, el.role ));
      });

      self.hypothesis_list.removeAll();
      _.each( JSON.parse( hypothesis_data[0] ), function(el) {
        var o=self.outcome_idx[el.outcome_id];
        var p=self.persona_idx[el.persona_id];

        self.add_hypothesis(new Hypothesis(el.id, self.current_project(), o, p, el.description));
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
