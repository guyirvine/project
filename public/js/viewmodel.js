function ViewModel() {
  var self=this;

  self.last=null;
  self.curr=null;

  /****************************************************************************/
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

  self.range_list = ko.observableArray();
  self.range_idx = {};
  self.status_list = ko.observableArray();
  self.status_idx = {};
  self.outcome_list = ko.observableArray();
  self.outcome_idx = {};
  self.persona_list = ko.observableArray();
  self.persona_idx = {};
  self.hypothesis_list = ko.observableArray();

  self.persona_display_list = ko.computed(function() {
    return _.filter( self.persona_list(), function(el) {return el.id !== null;});
  });
  self.outcome_display_list = ko.computed(function() {
    return _.filter( self.outcome_list(), function(el) {return el.id !== null;});
  });

  self.current_list = ko.computed(function() {
    return _.filter( self.hypothesis_list(), function(el) {return el.status().id === Status.OPEN;});
  });
  self.backlog_list = ko.computed(function() {
    return _.filter( self.hypothesis_list(), function(el) {return el.status().id === Status.BACKLOG;});
  });
  self.closed_list = ko.computed(function() {
    return _.filter( self.hypothesis_list(), function(el) {return el.status().id === Status.CLOSED;});
  });

  /****************************************************************************/
  self.new_outcome = function() {
    var l=self.outcome_list();
    var seq=1;
    if ( l.length > 0 ) {
      seq = l[l.length-1].seq+1;
    }

    var o = new Outcome(null, self.current_project(), "", "", seq);
    o.select();
  };

  self.new_persona = function() {
    var l=self.persona_list();
    var seq=1;
    if ( l.length > 0 ) {
      seq = l[l.length-1].seq+1;
    }

    var p = new Persona(null, self.current_project(), "", "", seq);
    p.select();
  };

  self.new_hypothesis = function( status_id ) {
    var l=self.hypothesis_list();
    var seq=1;
    if ( l.length > 0 ) {
      seq = l[l.length-1].seq+1;
    }

    var status=vm.status_idx[status_id];

    var h = new Hypothesis(null, self.current_project(), null, null, null, 1, 1, status, seq);
    h.select();
  };

  /****************************************************************************/
  self.add_range=function(r) {
    self.range_list.push(r);
    self.range_idx[r.id]=r;
  };
  self.add_status=function(s) {
    self.status_list.push(s);
    self.status_idx[s.id]=s;
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
  };

  /****************************************************************************/
  self.show_form=function(c) {
  	$( "body" ).addClass( "showForm" );
  	$( "div." + c ).removeClass( "hide" );
  };
  self.close_form=function() {
  	$( "body" ).removeClass( "showForm" );
  	$( "div.form" ).addClass( "hide" );
    ko.cleanNode($('div.form')[0]);
  };

  /****************************************************************************/
  self.show_project = function(id) {
    da.get_for_project( id );
    self.show( "hypothesis-panels" );
  };

  self._show = function( c ) {
    $( "section" ).addClass( "hide" );
    $( "section." + c ).removeClass( "hide" );

    $( "div.body header nav a" ).removeClass( "selected" );
    $( "div.body header nav a." + c ).addClass( "selected" );
  };

  self.show = function( c ) {
    self.last=self.curr;
    self.curr=c;
    self._show( c );
    history.pushState( { "view": c }, 'c', "#" + c );
  };

  self.ret = function() {
    var c=self.last;

    self.last=self.curr;
    self.curr=c;
    self._show( c );
    history.pushState( { "view": c }, 'c', "#" + c );
  };

  /****************************************************************************/
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

  /****************************************************************************/
  self.add_range( new Range( Range.LOW, 'Low' ) );
  self.add_range( new Range( Range.MEDIUM, 'Medium' ) );
  self.add_range( new Range( Range.HIGH, 'High' ) );

  $.when(
    $.get('/status'),
    $.get('/project')
  ).done(function( status_data, project_list_data ) {
    _.each(JSON.parse( status_data[0] ), function(el) {
      self.add_status( new Status( Number(el.id), el.name ) );
    });

    _.each(JSON.parse( project_list_data[0] ), function(el) {
      self.add_project( new Project( el.id, el.name ) );
    });
    self.project_list()[0].select();
  });
}
