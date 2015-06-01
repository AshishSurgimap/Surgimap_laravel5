@extends('app')

@section('title', 'Register')

@section('js-content')
<script src="{{ asset('/custom/js/register/register.js')}}"></script>
@endsection

@section('content')
<div class="container-fluid">
	<div class="row">
		<div class= "header-login">
			<div class="col-md-11 col-md-offset-1">
				<span>Registration</span>
				<hr>
			</div>
		</div>
		<div class="col-md-5 col-md-offset-1">
			@if (count($errors) > 0)
				<div class="alert alert-danger">
					<strong>Whoops!</strong> There were some problems with your input.<br><br>
					<ul>
						@foreach ($errors->all() as $error)
							<li>{{ $error }}</li>
						@endforeach
					</ul>
				</div>
			@endif
			<form role="form" method="POST" action="{{ url('/auth/register') }}">
			    <input type="hidden" name="_token" value="{{ csrf_token() }}">
			    <div class="row">
					<div class="col-lg-9">
					    <div class="form-group">
					        <label for="inputEmail">E-Mail Address</label>
					        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}"  placeholder="E-Mail Address">
					    </div>
					</div>
			    </div>
			    <div class="row">
					<div class="col-lg-9">
					    <div class="form-group">
					        <label for="inputPassword">Password</label>
					        <input id="password" type="password" class="form-control" name="password" placeholder="Password">
					    </div>
					</div>
				</div>
			    <div class="row">
					<div class="col-lg-9">
					    <div class="form-group">
					        <label for="inputConPassword">Confirm Password</label>
					        <input id="passwordc" type="Password" class="form-control" name="inputConPassword" placeholder="Repeat Password">
					    </div>
				    </div>
				</div>
				<div class="row">
					<div class="col-lg-12">
						<div class="form-group">
							I  certify that I have read and agree to the
							<a id="termsOfUser" class="hand-cursor" data-toggle="modal" data-target="#termsOfUserModal" href"#">Surgimap Terms of Use</a>,
							<a id="userAgreement" class="hand-cursor" data-toggle="modal" data-target="#userAgreementModal">Nemaris Inc User Agreement</a>,
							<a id="businessAgreement" class="hand-cursor" data-toggle="modal" data-target="#businessAgreementModal">Business Associate Agreement</a>
							(HIPAA compliance) and to receive account related communications from Nemaris Inc. electronically.
					    </div>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-7">
					    <div class="checkbox">
					        <label><input id="termsOfService" type="checkbox"> I Agree and Accept</label>
					    </div>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-2">
						<button id="btnRegister" type="submit" class="btn btn-primary" disabled="disabled">Register</button>
					</div>
					<div class="col-lg-8">
						<span class="terms-msg">Please accept terms and conditions to register.</span>
					</div>
				</div>
			</form>
			<!-- <form class="form-horizontal" role="form" method="POST" action="{{ url('/auth/register') }}">
				<input type="hidden" name="_token" value="{{ csrf_token() }}">

				<div class="form-group">
					<label class="col-md-4 control-label">Name</label>
					<div class="col-md-6">
						<input type="text" class="form-control" name="name" value="{{ old('name') }}">
					</div>
				</div>

				<div class="form-group">
					<label class="col-md-4 control-label">E-Mail Address</label>
					<div class="col-md-6">
						<input type="email" class="form-control" name="email" value="{{ old('email') }}">
					</div>
				</div>

				<div class="form-group">
					<label class="col-md-4 control-label">Password</label>
					<div class="col-md-6">
						<input type="password" class="form-control" name="password">
					</div>
				</div>

				<div class="form-group">
					<label class="col-md-4 control-label">Confirm Password</label>
					<div class="col-md-6">
						<input type="password" class="form-control" name="password_confirmation">
					</div>
				</div>

				<div class="form-group">
					<div class="col-md-6 col-md-offset-4">
						<button type="submit" class="btn btn-primary">
							Register
						</button>
					</div>
				</div>
			</form> -->
		</div>
	</div>
</div>
@include('auth.terms_condition_modal')
@endsection