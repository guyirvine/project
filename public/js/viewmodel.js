function HypothesisViewModel() {
  var self=this;

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

  self.outcome_list = ko.observableArray();
  self.outcome_idx = {};
  self.persona_list = ko.observableArray();
  self.persona_idx = {};
  self.backlog_list = ko.observableArray();
  self.backlog_idx = {};
  self.hypothesis_list = ko.observableArray();
  self.hypothesis_idx = {};
  self.list = ko.observableArray();

  /****************************************************************************/
  self.new_backlogitem = function() {
    var l=self.backlog_list();
    var seq=1;
    if ( l.length > 0 ) {
      seq = l[l.length-1].seq+1;
    }

    var b = new Backlog(null, self.current_project(), "", "", seq);
    b.select();
  };
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

  self.new_hypothesis = function() {
    var l=self.hypothesis_list();
    var seq=1;
    if ( l.length > 0 ) {
      seq = l[l.length-1].seq+1;
    }

    var h = new Hypothesis(null, self.current_project(), null, null, null, 1, 1, seq);
    h.select();
  };

  /****************************************************************************/
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
  $.get('/project', function(project_list_data) {
    _.each(JSON.parse( project_list_data ), function(el) {
      self.add_project( new Project( el.id, el.name ) );
    });
    self.project_list()[0].select();
  });
}
