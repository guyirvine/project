/******************************************************************************/
Status.BACKLOG=1;
Status.OPEN=2;
Status.CLOSED=3;
function Status(id, n) {
  var self=this;

  self.id=id;
  self.name=ko.observable(n);

}

/******************************************************************************/
Range.LOW=1;
Range.MEDIUM=2;
Range.HIGH=3;
function Range(id, n) {
  var self=this;

  self.id=id;
  self.name=ko.observable(n);
}

/******************************************************************************/
function Project(id, n) {
  var self=this;

  self.id=id;
  self.name=ko.observable(n);
  self.selected=ko.observable(false);

  self.select = function() {
    if ( vm.current_project() !== undefined ) {
      vm.current_project().selected( false );
    }
    self.selected( true );

    vm.show_project( self.id );
  };

  self.select2 = function() {
    if ( vm.current_project() !== undefined ) {
      vm.current_project().selected( false );
    }
    self.selected( true );

    vm.current_project( self );
    vm.show("project-form");
    $( 'section.project-form input' ).focus();
  };

  self.submit = function(e) {

    da.update_project( self, function(id) {
      console.log( 'project.submit. id: ', id, ', self.id: ', self.id );
      if ( self.id === null ) {
        console.log( 'project.submit. inside' );
        self.id=id;
        vm.add_project( self );
      }
      vm.show_project( id );
    });
  };
}

/******************************************************************************/
function Outcome(id, p, n, d, s) {
  var self=this;

  self.id = id;
  self.project = ko.observable(p);
  self.name=ko.observable(n);
  self.description=ko.observable(d);
  self.seq=s;

  self.select = function() {
    vm.currentOutcome( self );
    vm.show("outcome-form");
    $( 'section.outcome-form input' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    da.update_outcome( self, function(id) {
      if ( self.id === null ) {
        self.id = id;
        vm.add_outcome( self );
      }
    });
  };
}

/******************************************************************************/
function Persona(id, p, n, r, s) {
  var self=this;

  self.id = id;
  self.project=ko.observable(p);
  self.name=ko.observable(n);
  self.role=ko.observable(r);
  self.seq=s;

  self.labelHtml=ko.computed(function() {
    return self.name() + " <span class='role'>- " + self.role() + "</span>";
  });

  self.label=ko.computed(function() {
    return self.name() + " - " + self.role();
  });


  self.select = function() {
    vm.currentPersona( self );
    vm.show("persona-form");
    $( 'section.persona-form input.name' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    da.update_persona( self, function(id) {
      if ( self.id === null ) {
        self.id = id;
        vm.add_persona( self );
      }
    });
  };
}

/******************************************************************************/
function Hypothesis(id, pr, o, p, d, t, i, u, st, s) {
  var self=this;

  self.id = id;
  self.project = ko.observable(pr);
  self.outcome=ko.observable(o);
  self.persona=ko.observable(p);
  self.description=ko.observable(d);
  self.testing=ko.observable(t);
  self.importance=ko.observable(i);
  self.uncertainty=ko.observable(u);
  self.status=ko.observable(st);
  self.seq=s;

  self.select = function(e) {
    vm.show("hypothesis-form");
    vm.currentHypothesis( self );
    $( 'section.hypothesis-form textarea' ).focus();
  };

  self.submit = function(e) {
    vm.ret();

    if ( self.id === null ) {
      vm.add_hypothesis( self );
    }

    da.update_hypothesis( self );
  };
}
